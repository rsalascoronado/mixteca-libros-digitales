
import { supabase } from '@/integrations/supabase/client';
import { createBucketIfNotExists, uploadFile, getPublicUrl } from '@/utils/supabaseStorage';
import { isLibrarian } from '@/lib/user-utils';

export const uploadDigitalBookFile = async (
  bucketName: string, 
  fileName: string, 
  file: File
) => {
  try {
    // Verificar que el bucket existe
    const bucketCreated = await createBucketIfNotExists(bucketName);
    if (!bucketCreated) {
      throw new Error('Could not create or access bucket');
    }

    // Verificar que el usuario está autenticado y tiene los permisos necesarios
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User must be authenticated to upload files');
    }

    // Obtener el usuario y verificar si tiene el rol adecuado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isLibrarian({ ...user, role: user.app_metadata.role })) {
      throw new Error('Unauthorized: Only librarians and administrators can upload digital books');
    }

    const { data, error } = await uploadFile(bucketName, fileName, file);
    
    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    const publicUrl = getPublicUrl(bucketName, fileName);
    return { publicUrl, error: null };
  } catch (err) {
    console.error('Storage upload error:', err);
    return { publicUrl: null, error: err };
  }
};
