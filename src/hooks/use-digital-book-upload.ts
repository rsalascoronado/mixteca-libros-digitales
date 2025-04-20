
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
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
      const validationResult = validateUploadableFile(file, formato, book);
      if (!validationResult.isValid) return false;

      setIsUploading(true);
      setUploadProgress(10);
      
      const fileName = generateDigitalBookFileName(book, file);
      
      setUploadProgress(30);
      
      const { publicUrl, error } = await uploadDigitalBookFile('digital-books', fileName, file);
      
      if (error) {
        toast({
          title: "Error",
          description: "No se pudo guardar el archivo digital: " + error.message,
          variant: "destructive"
        });
        return false;
      }
      
      setUploadProgress(90);
      
      onUploadComplete({
        formato,
        url: publicUrl || '', 
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
      console.error('Upload error:', error);
      
      toast({
        title: "Error",
        description: "No se pudo guardar el archivo digital. Intente nuevamente.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    isUploading,
    uploadProgress,
    handleUpload
  };
}
