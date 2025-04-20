
import { supabase } from '@/integrations/supabase/client';

export const createBucketIfNotExists = async (bucketName: string): Promise<boolean> => {
  try {
    const { data: bucket, error: bucketError } = await supabase.storage.getBucket(bucketName);
    
    if (bucketError && bucketError.message.includes('does not exist')) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['application/pdf', 'application/epub+zip', 'application/x-mobipocket-ebook', 'text/html']
      });
      
      return !createError;
    }
    
    return !bucketError;
  } catch (err) {
    console.error('Error al verificar/crear bucket:', err);
    return false;
  }
};

export const uploadFile = async (bucketName: string, fileName: string, file: File) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) throw error;
    return { data, error: null };
  } catch (err) {
    return { 
      data: null, 
      error: err instanceof Error ? err : new Error('Error desconocido') 
    };
  }
};

export const getPublicUrl = (bucketName: string, fileName: string): string => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
  return data.publicUrl;
};

export const deleteFile = async (bucketName: string, fileName: string) => {
  return await supabase.storage.from(bucketName).remove([fileName]);
};
