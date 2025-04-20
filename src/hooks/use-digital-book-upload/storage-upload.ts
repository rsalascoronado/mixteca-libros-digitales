
import { supabase } from '@/integrations/supabase/client';
import { createBucketIfNotExists, uploadFile, getPublicUrl } from '@/utils/supabaseStorage';

export const uploadDigitalBookFile = async (
  bucketName: string, 
  fileName: string, 
  file: File
) => {
  try {
    const bucketCreated = await createBucketIfNotExists(bucketName);
    if (!bucketCreated) {
      throw new Error('Could not create or access bucket');
    }

    // Verificar que el usuario está autenticado antes de subir
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User must be authenticated to upload files');
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
