
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
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
      throw new Error('El archivo no debe exceder 50MB');
    }
  };

  const checkBucketExists = async () => {
    try {
      const { data, error } = await supabase.storage.getBucket(BUCKET_NAME);
      
      if (error) {
        if (error.message.includes('The resource was not found')) {
          return false; // Bucket no existe
        }
        throw error; // Otro tipo de error
      }
      
      // Si llegamos aquí, el bucket existe
      console.log(`Bucket '${BUCKET_NAME}' encontrado:`, data);
      return true;
    } catch (error) {
      console.error('Error al verificar bucket:', error);
      if (error instanceof Error && error.message.includes('The resource was not found')) {
        return false;
      }
      throw error;
    }
  };

  const createBucket = async () => {
    try {
      console.log(`Intentando crear bucket '${BUCKET_NAME}'...`);
      
      const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: MAX_FILE_SIZE
      });
      
      if (error) {
        // Si el error es porque el bucket ya existe, podemos continuar
        if (error.message.includes('already exists')) {
          console.log(`El bucket '${BUCKET_NAME}' ya existe, continuando...`);
          return;
        }
        
        console.error('Error al crear bucket:', error);
        throw new Error(`No se pudo crear el almacenamiento. ${error.message}`);
      }
      
      console.log(`Bucket '${BUCKET_NAME}' creado exitosamente:`, data);
    } catch (error) {
      console.error('Error al crear bucket:', error);
      throw error;
    }
  };

  const ensureBucketExists = async () => {
    try {
      const bucketExists = await checkBucketExists();
      
      if (!bucketExists) {
        await createBucket();
      }
    } catch (error) {
      console.error('Error al verificar/crear bucket:', error);
      
      // Verificamos si el error es de tipo "permission denied" o similar
      if (error instanceof Error && 
          (error.message.includes('permission') || 
           error.message.includes('not authorized'))) {
        throw new Error('No tiene permisos suficientes para acceder al almacenamiento. Contacte al administrador.');
      }
      
      throw error;
    }
  };

  const uploadThesisFile = async (file: File, thesisId?: string) => {
    try {
      validateFile(file);
      setIsUploading(true);
      setUploadProgress(0);
      
      // Intentamos asegurar que el bucket exista
      try {
        await ensureBucketExists();
      } catch (error) {
        console.error('Error al verificar bucket, intentando subir de todas formas:', error);
        // Continuamos con la carga de todas formas, ya que el bucket podría existir
        // aunque no tengamos permisos para verificarlo
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `thesis-${thesisId ? `edit-${thesisId}-` : ''}${Date.now()}.${fileExt}`;
      
      console.log('Iniciando carga de archivo:', fileName);
      
      // Definimos una función para simular el progreso mientras se carga el archivo
      const startProgressSimulation = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          if (progress >= 90) {
            clearInterval(interval);
            progress = 90;
          }
          setUploadProgress(progress);
        }, 300);
        return interval;
      };
      
      const progressInterval = startProgressSimulation();

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      clearInterval(progressInterval);

      if (error) {
        console.error('Error al cargar archivo:', error);
        throw new Error(`Error al subir el archivo: ${error.message}`);
      }

      setUploadProgress(100);
      console.log(`Archivo subido completamente (100%)`);

      // Intentamos obtener la URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);
      
      console.log('URL generada:', publicUrl);
      
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
    }
  };

  return { uploadThesisFile, isUploading, uploadProgress };
};
