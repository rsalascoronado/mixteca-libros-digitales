
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
      return;
    }
    
    const bucketExists = existingBuckets.some(b => b.name === bucketName);
    
    if (!bucketExists) {
      // Crear el bucket si no existe
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true // Hacer que el bucket sea público para acceso a los PDFs
      });
      
      if (error) {
        console.error(`Error creando bucket ${bucketName}:`, error);
        return;
      }
      
      // Crear políticas de acceso público para el bucket
      await setPublicBucketPolicy(bucketName);
      
      console.log(`Bucket ${bucketName} creado exitosamente`, data);
    } else {
      console.log(`Bucket ${bucketName} ya existe`);
    }
  } catch (error) {
    console.error(`Error verificando/creando bucket ${bucketName}:`, error);
    throw error;
  }
};

const setPublicBucketPolicy = async (bucketName: string) => {
  try {
    // Permitir acceso público para listar archivos
    await supabase.rpc('create_or_update_storage_policy', {
      bucket_name: bucketName,
      policy_action: 'SELECT',
      policy_definition: 'true',
      policy_name: `${bucketName}_public_select`
    });

    // Permitir acceso público para descargar archivos
    await supabase.rpc('create_or_update_storage_policy', {
      bucket_name: bucketName,
      policy_action: 'READ',
      policy_definition: 'true',
      policy_name: `${bucketName}_public_read`
    });

    // Permitir a usuarios autenticados subir archivos
    await supabase.rpc('create_or_update_storage_policy', {
      bucket_name: bucketName,
      policy_action: 'INSERT',
      policy_definition: 'auth.role() = \'authenticated\'',
      policy_name: `${bucketName}_auth_insert`
    });

    // Permitir a usuarios autenticados actualizar sus propios archivos
    await supabase.rpc('create_or_update_storage_policy', {
      bucket_name: bucketName,
      policy_action: 'UPDATE',
      policy_definition: 'auth.role() = \'authenticated\'',
      policy_name: `${bucketName}_auth_update`
    });

    // Permitir a usuarios autenticados eliminar sus propios archivos
    await supabase.rpc('create_or_update_storage_policy', {
      bucket_name: bucketName,
      policy_action: 'DELETE',
      policy_definition: 'auth.role() = \'authenticated\'',
      policy_name: `${bucketName}_auth_delete`
    });

    console.log(`Políticas públicas configuradas para el bucket ${bucketName}`);
  } catch (error) {
    console.error(`Error configurando políticas para el bucket ${bucketName}:`, error);
  }
};
