
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { Book } from '@/types';
import { validateUploadableFile, generateDigitalBookFileName } from './use-digital-book-upload/file-validation';
import { uploadDigitalBookFile } from './use-digital-book-upload/storage-upload';
import { getFormattedSize } from '@/utils/fileValidation';
import { saveDigitalBook } from '@/lib/db';

export function useDigitalBookUpload(
  book: Book, 
  onUploadComplete: (data: {
    formato: string;
    url: string;
    tamanioMb: number;
    resumen?: string;
    storage_path?: string;
  }) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentFormat, setCurrentFormat] = useState<string | null>(null);
  const [currentResumen, setCurrentResumen] = useState<string | undefined>(undefined);

  const simulateProgress = useCallback(() => {
    // Esta función simula el progreso de carga ya que Supabase no proporciona eventos de progreso
    let progress = 10;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15); // Incremento aleatorio
      
      if (progress >= 90) {
        clearInterval(interval);
        progress = 90; // Detenerse en 90% hasta que la operación se complete
      }
      
      setUploadProgress(progress);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);

  const handleRetry = useCallback(() => {
    if (currentFile && currentFormat) {
      handleUpload(currentFile, currentFormat, currentResumen);
    } else {
      setUploadError("No hay archivo para reintentar la carga");
      toast({
        title: "Error",
        description: "No hay archivo para reintentar la carga",
        variant: "destructive"
      });
    }
  }, [currentFile, currentFormat, currentResumen]);

  const handleUpload = async (file: File, formato: string, resumen?: string) => {
    try {
      // Guardar los datos actuales para posible reintento
      setCurrentFile(file);
      setCurrentFormat(formato);
      setCurrentResumen(resumen);
      
      setUploadError(null);
      console.log('Starting upload process for:', file.name);
      
      // Validar el archivo
      const validationResult = validateUploadableFile(file, formato, book);
      if (!validationResult.isValid) {
        console.error('Validation failed:', validationResult.error);
        setUploadError(validationResult.error || "El archivo no cumple con los requisitos");
        toast({
          title: "Error de validación",
          description: validationResult.error || "El archivo no cumple con los requisitos",
          variant: "destructive"
        });
        return false;
      }

      setIsUploading(true);
      setUploadProgress(10);
      
      // Generar nombre único para el archivo
      const fileName = generateDigitalBookFileName(book, file);
      console.log('Generated filename:', fileName);
      
      // Iniciar simulación de progreso
      const stopProgressSimulation = simulateProgress();
      
      try {
        console.log('Uploading to storage bucket: digital-books');
        const { publicUrl, error } = await uploadDigitalBookFile('digital-books', fileName, file);
        
        // Detener la simulación y establecer el progreso según el resultado
        stopProgressSimulation();
        
        if (error && !publicUrl) {
          console.error('Upload error:', error);
          setUploadError(error instanceof Error ? error.message : String(error));
          setUploadProgress(0);
          toast({
            title: "Error",
            description: "No se pudo guardar el archivo digital: " + (error instanceof Error ? error.message : String(error)),
            variant: "destructive"
          });
          return false;
        }
        
        if (!publicUrl) {
          console.error('No public URL returned');
          setUploadError("No se pudo obtener la URL del archivo subido");
          setUploadProgress(0);
          toast({
            title: "Error",
            description: "No se pudo obtener la URL del archivo subido.",
            variant: "destructive"
          });
          return false;
        }
        
        console.log('File uploaded successfully, public URL:', publicUrl);
        setUploadProgress(100);
        
        try {
          // Guardar en la base de datos
          const digitalBookData = {
            bookId: book.id,
            formato: formato as 'PDF' | 'EPUB' | 'MOBI' | 'HTML',
            url: publicUrl,
            tamanioMb: getFormattedSize(file.size),
            fechaSubida: new Date(),
            resumen: resumen,
            storage_path: fileName
          };
          
          const savedDigitalBook = await saveDigitalBook(digitalBookData);
          console.log('Digital book saved to database:', savedDigitalBook);
          
          // Notificar que la carga se completó
          onUploadComplete({
            formato,
            url: publicUrl, 
            tamanioMb: getFormattedSize(file.size),
            resumen,
            storage_path: fileName
          });
          
          toast({
            title: "Archivo digital guardado",
            description: "Se ha guardado el archivo digital correctamente."
          });
        } catch (dbError) {
          console.error('Error guardando libro digital en la base de datos:', dbError);
          setUploadError(dbError instanceof Error ? dbError.message : 'Error guardando en la base de datos');
          toast({
            title: "Error",
            description: "Se subió el archivo pero hubo un error al guardar en la base de datos: " + 
              (dbError instanceof Error ? dbError.message : 'Error desconocido'),
            variant: "destructive"
          });
          return false;
        }
        
        // Resetear el estado después de un tiempo
        setTimeout(() => {
          setUploadError(null);
          setUploadProgress(0);
          setCurrentFile(null);
          setCurrentFormat(null);
          setCurrentResumen(undefined);
        }, 3000);
        
        return true;
      } catch (uploadError) {
        stopProgressSimulation();
        throw new Error(`Error en la carga: ${uploadError instanceof Error ? uploadError.message : 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Unexpected upload error:', error);
      setUploadError(error instanceof Error ? error.message : "Error inesperado durante la carga");
      setUploadProgress(0);
      toast({
        title: "Error",
        description: "No se pudo guardar el archivo digital: " + 
          (error instanceof Error ? error.message : "Error inesperado"),
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadError,
    handleUpload,
    handleRetry
  };
}
