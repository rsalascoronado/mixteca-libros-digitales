import { supabase } from '@/integrations/supabase/client';
import { createBucketIfNotExists, uploadFile, getPublicUrl } from '@/utils/supabaseStorage';
import { isLibrarian } from '@/lib/user-utils';
import { User } from '@/types';
import { UserRole } from '@/types/user';

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
    console.log('Starting upload process for:', fileName);
    
    // Get current user session
    const { data: { user: supabaseUser }, error: sessionError } = await supabase.auth.getUser();
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw new Error('Error de autenticación');
    }
    if (!supabaseUser) {
      throw new Error('Usuario no autenticado');
    }

    // Convert and check user role
    const appUser = mapSupabaseUserToAppUser(supabaseUser);
    if (!isLibrarian(appUser)) {
      throw new Error('No autorizado: Solo bibliotecarios y administradores pueden subir libros digitales');
    }

    // Ensure bucket exists
    const bucketCreated = await createBucketIfNotExists(bucketName);
    if (!bucketCreated) {
      throw new Error('No se pudo crear o acceder al bucket de almacenamiento');
    }

    // Upload file with improved error handling
    console.log('Uploading file to storage...');
    const { data, error: uploadError } = await uploadFile(bucketName, fileName, file);
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL for the uploaded file
    console.log('Getting public URL for uploaded file...');
    const publicUrl = getPublicUrl(bucketName, fileName);
    
    return { publicUrl, error: null };
  } catch (err) {
    console.error('Storage upload error:', err);
    return { 
      publicUrl: null, 
      error: err instanceof Error ? err : new Error('Error desconocido durante la carga') 
    };
  }
};
