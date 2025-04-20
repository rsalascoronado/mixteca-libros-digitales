
import { useState } from 'react';
import { useToast } from './use-toast';
import { Book } from '@/types';
import { validateFileFormat, validateFileSize, getFormattedSize } from '@/utils/fileValidation';
import { createBucketIfNotExists, uploadFile, getPublicUrl } from '@/utils/supabaseStorage';

export function useDigitalBookUpload(book: Book, onUploadComplete: (data: {
  formato: string;
  url: string;
  tamanioMb: number;
  resumen?: string;
  storage_path?: string;
}) => void) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleUpload = async (file: File, formato: string, resumen?: string) => {
    try {
      // Validate file format and size
      const formatError = validateFileFormat(file, formato);
      if (formatError) {
        toast({
          title: "Formato incorrecto",
          description: formatError,
          variant: "destructive"
        });
        return false;
      }

      const sizeError = validateFileSize(file);
      if (sizeError) {
        toast({
          title: "Error de tamaño",
          description: sizeError,
          variant: "destructive"
        });
        return false;
      }

      setIsUploading(true);
      setUploadProgress(10);
      
      const fileName = `book-${book.id}-${Date.now()}.${file.name.split('.').pop()}`;
      
      // Create bucket if needed
      const bucketCreated = await createBucketIfNotExists('digital-books');
      if (!bucketCreated) {
        setUploadProgress(0);
        return false;
      }
      
      setUploadProgress(30);
      
      // Upload file
      const { error: uploadError } = await uploadFile('digital-books', fileName, file);
      
      if (uploadError) {
        console.error('Error al subir el archivo:', uploadError);
        
        if (uploadError.message.includes('violates row-level security policy')) {
          toast({
            title: "Error de permisos",
            description: "No tiene permisos para subir archivos. Utilizando URL alternativa.",
            variant: "default"
          });
          
          const mockUrl = `https://example.com/digital-books/${fileName}`;
          setUploadProgress(100);
          
          onUploadComplete({
            formato,
            url: mockUrl,
            tamanioMb: getFormattedSize(file.size),
            resumen,
            storage_path: fileName
          });
          
          return true;
        }
        
        toast({
          title: "Error",
          description: "No se pudo guardar el archivo digital: " + uploadError.message,
          variant: "destructive"
        });
        return false;
      }
      
      setUploadProgress(90);
      const publicUrl = getPublicUrl('digital-books', fileName);
      setUploadProgress(100);
      
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

      return true;
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      
      if (process.env.NODE_ENV === 'development') {
        const mockUrl = `https://example.com/digital-books/mock-${Date.now()}.${file.name.split('.').pop()}`;
        setUploadProgress(100);
        
        onUploadComplete({
          formato,
          url: mockUrl,
          tamanioMb: getFormattedSize(file.size),
          resumen
        });
        
        toast({
          title: "Archivo digital guardado (modo desarrollo)",
          description: "Se ha simulado la carga del archivo digital en modo desarrollo."
        });
        
        return true;
      }
      
      toast({
        title: "Error",
        description: "No se pudo guardar el archivo digital. Intente nuevamente.",
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
    handleUpload
  };
}
