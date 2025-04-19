import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const BUCKET_NAME = 'thesis-files';

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

  const ensureBucketExists = async () => {
    try {
      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();
      
      if (bucketError) {
        console.error('Error al verificar buckets:', bucketError);
        throw new Error(`Error al verificar almacenamiento: ${bucketError.message}`);
      }

      const bucketExists = buckets.some(bucket => bucket.id === BUCKET_NAME);
      
      if (!bucketExists) {
        console.log(`El bucket '${BUCKET_NAME}' no existe. Intentando crearlo automáticamente...`);
        const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: MAX_FILE_SIZE
        });
        
        if (error) {
          console.error('Error al crear bucket:', error);
          throw new Error(`No se pudo crear el bucket '${BUCKET_NAME}'. Por favor, contacte al administrador.`);
        }
        
        console.log(`Bucket '${BUCKET_NAME}' creado exitosamente:`, data);
      }
    } catch (error) {
      console.error('Error al verificar/crear bucket:', error);
      throw error;
    }
  };

  const uploadThesisFile = async (file: File, thesisId?: string) => {
    try {
      validateFile(file);
      setIsUploading(true);
      setUploadProgress(0);
      
      await ensureBucketExists();
      
      const fileExt = file.name.split('.').pop();
      const fileName = `thesis-${thesisId ? `edit-${thesisId}-` : ''}${Date.now()}.${fileExt}`;
      
      console.log('Iniciando carga de archivo:', fileName);
      
      const uploadOptions = {
        cacheControl: '3600',
        upsert: false,
        contentType: 'application/pdf'
      };

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, uploadOptions);

      if (uploadError) {
        console.error('Error de carga:', uploadError);
        throw new Error(`Error al subir archivo: ${uploadError.message}`);
      }

      console.log('Archivo subido exitosamente:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
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
