
import { useState } from 'react';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/types';

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
      // Verify file size before starting the upload
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "Error de tamaño",
          description: "El archivo excede el límite de 50MB permitido.",
          variant: "destructive"
        });
        return false;
      }

      setIsUploading(true);
      setUploadProgress(10);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${book.id}-${Date.now()}.${fileExt}`;
      
      // Attempt to upload the file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('digital-books')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // Changed to true to allow overwriting existing files
        });

      if (uploadError) {
        console.error('Error al subir el archivo:', uploadError);
        
        // Handle specific error types
        if (uploadError.message.includes('size')) {
          toast({
            title: "Error de tamaño",
            description: "El archivo excede el límite de 50MB permitido por el servidor.",
            variant: "destructive"
          });
        } else if (uploadError.message.includes('auth')) {
          toast({
            title: "Error de autenticación",
            description: "Debe iniciar sesión para subir archivos.",
            variant: "destructive"
          });
        } else if (uploadError.message.includes('security')) {
          toast({
            title: "Error de seguridad",
            description: "No tiene permisos para subir archivos en este bucket.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "No se pudo guardar el archivo digital: " + uploadError.message,
            variant: "destructive"
          });
        }
        return false;
      }
      
      setUploadProgress(90);
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('digital-books')
        .getPublicUrl(fileName);
      
      setUploadProgress(100);
      
      onUploadComplete({
        formato,
        url: publicUrl,
        tamanioMb: Number((file.size / (1024 * 1024)).toFixed(2)),
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
      toast({
        title: "Error",
        description: "No se pudo guardar el archivo digital.",
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
