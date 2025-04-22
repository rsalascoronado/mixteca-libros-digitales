
import { supabase } from '@/integrations/supabase/client';
import { createBucketIfNotExists, uploadFile, getPublicUrl } from '@/utils/supabaseStorage';

export async function uploadDigitalBookFile(
  bucketName: string, 
  fileName: string, 
  file: File
): Promise<{ publicUrl: string | null; error: Error | null }> {
  try {
    console.log(`Iniciando carga de archivo digital: ${fileName} al bucket ${bucketName}`);
    
    // Verificar sesión activa
    const { data: session } = await supabase.auth.getSession();
    console.log("Estado de sesión para carga de libro digital:", 
      session?.session ? `Usuario autenticado: ${session.session.user.id}` : "No hay sesión activa");
    
    // Verificar que el bucket existe (aunque con las políticas actualizadas esto debería ser menos problemático)
    await createBucketIfNotExists(bucketName);
    
    // Realizar la carga del archivo al Storage
    const { data, error } = await uploadFile(bucketName, fileName, file);
    
    if (error) {
      console.error('Error uploading file to Supabase Storage:', error);
      return { publicUrl: null, error };
    }
    
    // Obtener la URL pública del archivo
    const filePath = data?.path || fileName;
    const publicUrl = getPublicUrl(bucketName, filePath);
    
    if (!publicUrl) {
      return { 
        publicUrl: null, 
        error: new Error('No se pudo obtener la URL pública del archivo') 
      };
    }
    
    console.log(`Archivo digital cargado exitosamente. URL pública: ${publicUrl}`);
    return { publicUrl, error: null };
  } catch (error) {
    console.error('Unexpected error in uploadDigitalBookFile:', error);
    return { 
      publicUrl: null, 
      error: error instanceof Error ? error : new Error('Error desconocido durante la carga') 
    };
  }
}
