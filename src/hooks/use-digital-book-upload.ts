
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Book } from '@/types';
import { validateUploadableFile, generateDigitalBookFileName } from './use-digital-book-upload/file-validation';
import { uploadDigitalBookFile } from './use-digital-book-upload/storage-upload';
import { getFormattedSize } from '@/utils/fileValidation';

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

  const handleUpload = async (file: File, formato: string, resumen?: string) => {
    try {
      console.log('Starting upload process for:', file.name);
      const validationResult = validateUploadableFile(file, formato, book);
      if (!validationResult.isValid) {
        console.error('Validation failed:', validationResult.error);
        toast({
          title: "Error de validación",
          description: validationResult.error || "El archivo no cumple con los requisitos",
          variant: "destructive"
        });
        return false;
      }

      setIsUploading(true);
      setUploadProgress(10);
      
      const fileName = generateDigitalBookFileName(book, file);
      console.log('Generated filename:', fileName);
      
      setUploadProgress(30);
      
      console.log('Uploading to storage bucket: digital-books');
      const { publicUrl, error } = await uploadDigitalBookFile('digital-books', fileName, file);
      
      if (error) {
        console.error('Upload error:', error);
        toast({
          title: "Error",
          description: "No se pudo guardar el archivo digital: " + (error instanceof Error ? error.message : String(error)),
          variant: "destructive"
        });
        return false;
      }
      
      if (!publicUrl) {
        console.error('No public URL returned');
        toast({
          title: "Error",
          description: "No se pudo obtener la URL del archivo subido.",
          variant: "destructive"
        });
        return false;
      }
      
      console.log('File uploaded successfully, public URL:', publicUrl);
      setUploadProgress(90);
      
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

      setUploadProgress(100);
      return true;
    } catch (error) {
      console.error('Unexpected upload error:', error);
      
      toast({
        title: "Error",
        description: "No se pudo guardar el archivo digital. Intente nuevamente.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  return {
    isUploading,
    uploadProgress,
    handleUpload
  };
}
