
import { supabase } from '@/integrations/supabase/client';

export const createBucketIfNotExists = async (bucketName: string): Promise<boolean> => {
  try {
    // Verificar si el bucket ya existe
    const { data: bucket, error: bucketError } = await supabase.storage.getBucket(bucketName);
    
    if (bucketError) {
      console.error('Error al verificar bucket:', bucketError);
      
      // Si el bucket no existe, intentar crearlo
      if (bucketError.message.includes('does not exist')) {
        const { error: createError } = await supabase.storage.createBucket(bucketName, {
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
      }
      
      return false;
    }
    
    console.log(`Bucket "${bucketName}" ya existe`);
    return true;
  } catch (err) {
    console.error('Error al verificar/crear bucket:', err);
    return false;
  }
};

export const uploadFile = async (bucketName: string, fileName: string, file: File) => {
  try {
    console.log(`Iniciando carga de archivo "${fileName}" al bucket "${bucketName}"`);
    
    // Verificar que el bucket existe antes de intentar cargar
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket(bucketName);
    
    if (bucketError) {
      console.error(`Error: El bucket "${bucketName}" no existe:`, bucketError);
      return { 
        data: null, 
        error: new Error(`El bucket "${bucketName}" no existe: ${bucketError.message}`) 
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
