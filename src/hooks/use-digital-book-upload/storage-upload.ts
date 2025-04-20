
import { supabase } from '@/integrations/supabase/client';
import { createBucketIfNotExists, uploadFile, getPublicUrl } from '@/utils/supabaseStorage';
import { isLibrarian } from '@/lib/user-utils';
import { User, UserRole } from '@/types';

// Helper function to convert Supabase user to our app's User type
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
    // Verificar que el bucket existe, o crearlo si no existe
    const bucketCreated = await createBucketIfNotExists(bucketName);
    if (!bucketCreated) {
      throw new Error('Could not create or access bucket');
    }

    // Verificar que el usuario tiene el rol adecuado
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();
    if (!supabaseUser) {
      throw new Error('Unauthorized: User not found');
    }
    
    // Convert Supabase user to our app's User type
    const appUser = mapSupabaseUserToAppUser(supabaseUser);
    
    if (!isLibrarian(appUser)) {
      throw new Error('Unauthorized: Only librarians and administrators can upload digital books');
    }

    // Upload the file to Supabase Storage
    const { data, error } = await uploadFile(bucketName, fileName, file);
    
    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get the public URL for the uploaded file
    const publicUrl = getPublicUrl(bucketName, fileName);
    return { publicUrl, error: null };
  } catch (err) {
    console.error('Storage upload error:', err);
    return { publicUrl: null, error: err };
  }
};
