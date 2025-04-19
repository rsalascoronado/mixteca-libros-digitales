
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useThesisFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadThesisFile = async (file: File, thesisId?: string) => {
    try {
      setIsUploading(true);
      
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
          contentType: 'application/pdf'
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
      
      return publicUrl;
    } catch (error) {
      console.error('Error al subir archivo:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadThesisFile, isUploading };
};
