
import { supabase } from '@/integrations/supabase/client';
import { createBucketIfNotExists, uploadFile, getPublicUrl } from '@/utils/supabaseStorage';
import { isLibrarian } from '@/lib/user-utils';
import { User, UserRole } from '@/types';

function mapSupabaseUserToAppUser(supabaseUser: any): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    nombre: supabaseUser.user_metadata?.nombre || 'Usuario',
    apellidos: supabaseUser.user_metadata?.apellidos || 'Sistema',
    role: (supabaseUser.app_metadata?.role || 'estudiante') as UserRole,
    createdAt: new Date(supabaseUser.created_at || Date.now())
  };
}

export const uploadDigitalBookFile = async (
  bucketName: string, 
  fileName: string, 
  file: File
) => {
  try {
    // Get current user session
    const { data: { user: supabaseUser }, error: sessionError } = await supabase.auth.getUser();
    if (sessionError) throw new Error('Error de autenticación');
    if (!supabaseUser) throw new Error('Usuario no autenticado');

    // Check user role
    const appUser = mapSupabaseUserToAppUser(supabaseUser);
    if (!isLibrarian(appUser)) {
      throw new Error('No autorizado: Solo bibliotecarios pueden subir libros digitales');
    }

    // Ensure bucket exists
    const bucketCreated = await createBucketIfNotExists(bucketName);
    if (!bucketCreated) {
      throw new Error('Error al acceder al almacenamiento');
    }

    // Upload file
    const { data, error: uploadError } = await uploadFile(bucketName, fileName, file);
    if (uploadError) throw uploadError;

    // Get public URL
    const publicUrl = getPublicUrl(bucketName, fileName);
    return { publicUrl, error: null };
    
  } catch (err) {
    console.error('Error en la carga:', err);
    return { 
      publicUrl: null, 
      error: err instanceof Error ? err : new Error('Error desconocido') 
    };
  }
};
