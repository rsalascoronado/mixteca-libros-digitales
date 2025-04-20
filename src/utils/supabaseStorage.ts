
import { supabase } from '@/integrations/supabase/client';

export const createBucketIfNotExists = async (bucketName: string): Promise<boolean> => {
  try {
    console.log('Checking if bucket exists:', bucketName);
    const { data: bucket, error: bucketError } = await supabase.storage.getBucket(bucketName);
    
    if (bucketError && bucketError.message.includes('does not exist')) {
      console.log('Creating new bucket:', bucketName);
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: [
          'application/pdf',
          'application/epub+zip',
          'application/x-mobipocket-ebook',
          'text/html'
        ]
      });
      
      if (createError) {
        console.error('Error creating bucket:', createError);
        return false;
      }
      
      return true;
    }
    
    return !bucketError;
  } catch (err) {
    console.error('Error checking/creating bucket:', err);
    return false;
  }
};

export const uploadFile = async (bucketName: string, fileName: string, file: File) => {
  try {
    console.log(`Uploading file to ${bucketName}/${fileName}`);
    
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    console.log('File uploaded successfully:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Upload error:', err);
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Error desconocido durante la carga') 
    };
  }
};

export const getPublicUrl = (bucketName: string, fileName: string): string => {
  const { data } = supabase.storage
    .from(bucketName)
    .getPublicUrl(fileName);
  
  console.log(`Generated public URL for ${bucketName}/${fileName}:`, data.publicUrl);
  return data.publicUrl;
};

export const deleteFile = async (bucketName: string, fileName: string) => {
  console.log(`Deleting file ${bucketName}/${fileName}`);
  return await supabase.storage
    .from(bucketName)
    .remove([fileName]);
};
