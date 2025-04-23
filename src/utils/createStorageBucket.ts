
import { supabase } from '@/integrations/supabase/client';

export const createStorageBuckets = async () => {
  try {
    // Verificar que el bucket existe o crearlo
    await createBucketIfNotExists('thesis-files');
    console.log('Bucket de tesis verificado o creado correctamente');
  } catch (error) {
    console.error('Error verificando o creando bucket de tesis:', error);
  }
};

export const createBucketIfNotExists = async (bucketName: string) => {
  try {
    // Verificar si el bucket ya existe
    const { data: existingBuckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('Error al listar buckets:', bucketError);
      return false;
    }
    
    const bucketExists = existingBuckets.some(b => b.name === bucketName);
    
    if (!bucketExists) {
      // Crear el bucket si no existe
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true // Hacer que el bucket sea público para acceso a los PDFs
      });
      
      if (error) {
        console.error(`Error creando bucket ${bucketName}:`, error);
        return false;
      }
      
      console.log(`Bucket ${bucketName} creado exitosamente`, data);
      return true;
    } else {
      console.log(`Bucket ${bucketName} ya existe`);
      return true;
    }
  } catch (error) {
    console.error(`Error verificando/creando bucket ${bucketName}:`, error);
    return false;
  }
};
