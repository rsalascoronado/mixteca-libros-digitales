
import { createBucketIfNotExists } from '@/utils/supabaseStorage';

export const createStorageBuckets = async (): Promise<void> => {
  try {
    console.log("Verificando buckets de almacenamiento...");
    
    // Verificar bucket para tesis
    await createBucketIfNotExists('thesis-files');
    console.log('Bucket de almacenamiento thesis-files verificado');
    
    // Verificar bucket para libros digitales
    await createBucketIfNotExists('digital-books');
    console.log('Bucket de almacenamiento digital-books verificado');
  } catch (error) {
    console.error('Error al crear buckets de almacenamiento:', error);
  }
};
