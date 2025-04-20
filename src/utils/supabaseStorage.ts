
import { supabase } from '@/integrations/supabase/client';

export const createBucketIfNotExists = async (bucketName: string): Promise<boolean> => {
  try {
    const { data: bucket, error: bucketError } = await supabase.storage.getBucket(bucketName);
    
    if (bucketError && bucketError.message.includes('does not exist')) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error('Bucket check error:', err);
    return false;
  }
};

export const uploadFile = async (bucketName: string, fileName: string, file: File) => {
  // Verificar la sesión actual
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { 
      error: new Error('User must be authenticated to upload files'),
      data: null
    };
  }

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });
    
  return { data, error };
};

export const getPublicUrl = (bucketName: string, fileName: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);
    
  return publicUrl;
};

export const deleteFile = async (bucketName: string, fileName: string) => {
  // Verificar la sesión actual
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { 
      error: new Error('User must be authenticated to delete files'),
      data: null
    };
  }

  return await supabase.storage
    .from(bucketName)
    .remove([fileName]);
};
