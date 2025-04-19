
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const useThesisFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const validateFile = (file: File) => {
    if (!file.type.includes('pdf')) {
      throw new Error('Solo se permiten archivos PDF');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('El archivo no debe exceder 100MB');
    }
  };

  const uploadThesisFile = async (file: File, thesisId?: string) => {
    try {
      validateFile(file);
      setIsUploading(true);
      setUploadProgress(0);
      
      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketError) {
        console.error('Error al verificar buckets:', bucketError);
        throw new Error(`Error al verificar almacenamiento: ${bucketError.message}`);
      }

      const bucketExists = buckets.some(bucket => bucket.id === 'thesis-files');
      if (!bucketExists) {
        throw new Error(`El bucket 'thesis-files' no existe. Por favor, contacte al administrador.`);
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `thesis-${thesisId ? `edit-${thesisId}-` : ''}${Date.now()}.${fileExt}`;
      
      console.log('Iniciando carga de archivo:', fileName);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('thesis-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'application/pdf',
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percent));
            console.log(`Upload progress: ${Math.round(percent)}%`);
          }
        });

      if (uploadError) {
        console.error('Error de carga:', uploadError);
        throw new Error(`Error al subir archivo: ${uploadError.message}`);
      }

      console.log('Archivo subido exitosamente:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('thesis-files')
        .getPublicUrl(fileName);

      console.log('URL pública generada:', publicUrl);
      
      toast({
        title: "Archivo subido exitosamente",
        description: "El archivo PDF ha sido guardado correctamente.",
      });

      return publicUrl;
    } catch (error) {
      console.error('Error al subir archivo:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al subir el archivo",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return { uploadThesisFile, isUploading, uploadProgress };
};
