
import { supabase } from '@/integrations/supabase/client';

export const createBucketIfNotExists = async (bucketName: string): Promise<boolean> => {
  try {
    // Check if bucket exists
    const { data: bucket, error: bucketError } = await supabase.storage.getBucket(bucketName);
    
    // If bucket doesn't exist, create it
    if (bucketError && bucketError.message.includes('does not exist')) {
      console.log(`Creating bucket: ${bucketName}`);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800 // 50MB
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
      
      // Set bucket to public
      const { error: policyError } = await supabase.storage.from(bucketName).createSignedUrl('dummy.txt', 3600);
      if (policyError && !policyError.message.includes('does not exist')) {
        console.error('Error setting bucket policy:', policyError);
      }
    }
    return true;
  } catch (err) {
    console.error('Bucket check/creation error:', err);
    return false;
  }
};

export const uploadFile = async (bucketName: string, fileName: string, file: File) => {
  try {
    console.log(`Uploading file to ${bucketName}/${fileName}`);
    
    // Attempt the upload
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    // Log the result for debugging
    if (error) {
      console.error('Error uploading file:', error);
    } else {
      console.log('File uploaded successfully:', data);
    }
    
    return { data, error };
  } catch (err) {
    console.error('Unexpected error in uploadFile:', err);
    return { data: null, error: err instanceof Error ? err : new Error('Unknown error during upload') };
  }
};

export const getPublicUrl = (bucketName: string, fileName: string): string => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);
    
  console.log(`Generated public URL for ${bucketName}/${fileName}: ${data.publicUrl}`);
  return data.publicUrl;
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
