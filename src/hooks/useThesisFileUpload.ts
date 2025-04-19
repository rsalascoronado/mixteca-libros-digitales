
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const BUCKET_NAME = 'thesis-files';

export const useThesisFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { hasRole } = useAuth();
  const isAdmin = hasRole(['administrador']);

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
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) throw error;
      
      const bucketExists = data.some(bucket => bucket.name === BUCKET_NAME);
      console.log(`Bucket '${BUCKET_NAME}' existe: ${bucketExists}`);
      return bucketExists;
    } catch (error) {
      console.error('Error al verificar bucket:', error);
      return false;
    }
  };

  const createBucket = async () => {
    try {
      console.log(`Intentando crear bucket '${BUCKET_NAME}'...`);
      
      // Primero creamos el bucket
      const { data, error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: MAX_FILE_SIZE
      });
      
      if (error) {
        // Si el error es porque el bucket ya existe, podemos continuar
        if (error.message.includes('already exists')) {
          console.log(`El bucket '${BUCKET_NAME}' ya existe, continuando...`);
          return true;
        }
        
        console.error('Error al crear bucket:', error);
        throw new Error(`No se pudo crear el almacenamiento. ${error.message}`);
      }
      
      console.log(`Bucket '${BUCKET_NAME}' creado exitosamente:`, data);
      
      // Configuramos políticas de acceso público para el bucket
      // Política para permitir que cualquier usuario pueda leer los archivos
      const { error: policyError } = await supabase.storage
        .from(BUCKET_NAME)
        .createPolicy('public-read-policy', {
          name: 'Public Read Policy',
          definition: {
            statements: [
              {
                effect: 'allow',
                actions: ['select'],
                role: 'anon',
                condition: 'TRUE'
              }
            ]
          }
        });
      
      if (policyError) {
        console.error('Error al crear política de acceso público:', policyError);
        // No lanzamos error para no detener el flujo, ya intentamos con la config del bucket como público
      } else {
        console.log(`Política de acceso público creada exitosamente`);
      }
      
      return true;
    } catch (error) {
      console.error('Error al crear bucket:', error);
      throw error;
    }
  };

  const uploadThesisFile = async (file: File, thesisId?: string) => {
    try {
      validateFile(file);
      setIsUploading(true);
      setUploadProgress(0);
      
      // Verificamos si el bucket existe antes de intentar cargar el archivo
      const bucketExists = await checkBucketExists();
      
      if (!bucketExists) {
        // Intentamos crear el bucket si el usuario es administrador
        if (isAdmin) {
          console.log('Usuario es administrador, intentando crear el bucket...');
          const bucketCreated = await createBucket();
          if (!bucketCreated) {
            throw new Error('No se pudo crear el almacenamiento de tesis. Por favor intente más tarde o contacte al soporte técnico.');
          }
        } else {
          // Si no es administrador, mostramos mensaje para contactar al administrador
          throw new Error('El sistema de almacenamiento de tesis no está disponible. Por favor contacte al administrador.');
        }
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

      // Subimos el archivo con opción upsert para sobrescribir si ya existe
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      clearInterval(progressInterval);

      if (error) {
        console.error('Error al cargar archivo:', error);
        
        // Manejamos específicamente el error de RLS policy
        if (error.message.includes('row-level security')) {
          throw new Error('No tiene permisos para subir archivos. Contacte al administrador del sistema.');
        }
        
        throw new Error(`Error al subir el archivo: ${error.message}`);
      }

      setUploadProgress(100);
      console.log(`Archivo subido completamente (100%)`);

      // Verificamos y obtenemos la URL pública
      const { data: publicUrlData, error: publicUrlError } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(fileName);
      
      if (publicUrlError) {
        console.error('Error al obtener URL pública:', publicUrlError);
        throw new Error(`Error al generar el enlace del archivo: ${publicUrlError.message}`);
      }
      
      console.log('URL generada:', publicUrlData.publicUrl);
      
      toast({
        title: "Archivo subido exitosamente",
        description: "El archivo PDF ha sido guardado correctamente.",
      });

      return publicUrlData.publicUrl;
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
