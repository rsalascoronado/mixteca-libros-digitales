
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

// Interface for policy parameters with specific action types
interface PolicyParams {
  bucket_name: string;
  policy_action: string; // Using string instead of union type to avoid narrowing issues
  policy_definition: string;
  policy_name: string;
}

const setPublicBucketPolicy = async (bucketName: string) => {
  try {
    // Using explicit typing with a temporary variable to help TypeScript
    
    // Permitir acceso público para listar archivos
    const selectParams: PolicyParams = {
      bucket_name: bucketName,
      policy_action: 'SELECT',
      policy_definition: 'true',
      policy_name: `${bucketName}_public_select`
    };
    await (supabase.rpc as any)('create_or_update_storage_policy', selectParams);

    // Permitir acceso público para descargar archivos
    const readParams: PolicyParams = {
      bucket_name: bucketName,
      policy_action: 'READ',
      policy_definition: 'true',
      policy_name: `${bucketName}_public_read`
    };
    await (supabase.rpc as any)('create_or_update_storage_policy', readParams);

    // Permitir a usuarios autenticados subir archivos
    const insertParams: PolicyParams = {
      bucket_name: bucketName,
      policy_action: 'INSERT',
      policy_definition: 'auth.role() = \'authenticated\'',
      policy_name: `${bucketName}_auth_insert`
    };
    await (supabase.rpc as any)('create_or_update_storage_policy', insertParams);

    // Permitir a usuarios autenticados actualizar sus propios archivos
    const updateParams: PolicyParams = {
      bucket_name: bucketName,
      policy_action: 'UPDATE',
      policy_definition: 'auth.role() = \'authenticated\'',
      policy_name: `${bucketName}_auth_update`
    };
    await (supabase.rpc as any)('create_or_update_storage_policy', updateParams);

    // Permitir a usuarios autenticados eliminar sus propios archivos
    const deleteParams: PolicyParams = {
      bucket_name: bucketName,
      policy_action: 'DELETE',
      policy_definition: 'auth.role() = \'authenticated\'',
      policy_name: `${bucketName}_auth_delete`
    };
    await (supabase.rpc as any)('create_or_update_storage_policy', deleteParams);

    console.log(`Políticas públicas configuradas para el bucket ${bucketName}`);
  } catch (error) {
    console.error(`Error configurando políticas para el bucket ${bucketName}:`, error);
  }
};
