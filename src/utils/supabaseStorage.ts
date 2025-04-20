
import { supabase } from '@/integrations/supabase/client';

export const createBucketIfNotExists = async (bucketName: string): Promise<boolean> => {
  try {
    // Primero intentamos obtener el bucket para ver si existe
    const { data: existingBucket, error: getBucketError } = await supabase.storage.getBucket(bucketName);
    
    // Si no hay error, el bucket existe y podemos retornar true
    if (existingBucket && !getBucketError) {
      console.log(`Bucket "${bucketName}" ya existe`);
      return true;
    }
    
    // Si hay un error diferente a "not found", lo registramos y devolvemos false
    if (getBucketError && !getBucketError.message.includes('not found')) {
      console.error('Error al verificar bucket:', getBucketError);
      return false;
    }
    
    // Intentar crear el bucket ya que no existe
    console.log(`Bucket "${bucketName}" no encontrado, creando...`);
    const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['application/pdf', 'application/epub+zip', 'application/x-mobipocket-ebook', 'text/html']
    });
    
    if (createError) {
      console.error('Error al crear bucket:', createError);
      return false;
    }
    
    console.log(`Bucket "${bucketName}" creado exitosamente`);
    return true;
  } catch (err) {
    console.error('Error al verificar/crear bucket:', err);
    return false;
  }
};

export const uploadFile = async (bucketName: string, fileName: string, file: File) => {
  try {
    console.log(`Iniciando carga de archivo "${fileName}" al bucket "${bucketName}"`);
    
    // Primero verificamos que el bucket exista o lo creamos
    const bucketExists = await createBucketIfNotExists(bucketName);
    
    if (!bucketExists) {
      console.error(`Error: El bucket "${bucketName}" no pudo ser verificado o creado`);
      return { 
        data: null, 
        error: new Error(`No se pudo acceder o crear el bucket "${bucketName}"`) 
      };
    }
    
    // Realizar la carga del archivo
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error(`Error al cargar archivo "${fileName}":`, error);
      throw error;
    }
    
    console.log(`Archivo "${fileName}" cargado exitosamente:`, data);
    return { data, error: null };
  } catch (err) {
    console.error('Error en uploadFile:', err);
    return { 
      data: null, 
      error: err instanceof Error 
        ? err 
        : new Error(typeof err === 'object' && err !== null ? JSON.stringify(err) : 'Error desconocido al subir archivo') 
    };
  }
};

export const getPublicUrl = (bucketName: string, fileName: string): string => {
  try {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    
    if (!data || !data.publicUrl) {
      console.error(`No se pudo obtener URL pública para ${bucketName}/${fileName}`);
      return '';
    }
    
    console.log(`URL pública obtenida: ${data.publicUrl}`);
    return data.publicUrl;
  } catch (error) {
    console.error('Error al obtener URL pública:', error);
    return '';
  }
};

export const deleteFile = async (bucketName: string, fileName: string) => {
  try {
    console.log(`Eliminando archivo "${fileName}" del bucket "${bucketName}"`);
    const result = await supabase.storage.from(bucketName).remove([fileName]);
    
    if (result.error) {
      console.error(`Error al eliminar archivo "${fileName}":`, result.error);
    } else {
      console.log(`Archivo "${fileName}" eliminado exitosamente`);
    }
    
    return result;
  } catch (error) {
    console.error('Error en deleteFile:', error);
    return { data: null, error };
  }
};
