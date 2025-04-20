
import { supabase } from '@/integrations/supabase/client';

export async function createThesisStorageBucket() {
  try {
    // Check if the bucket already exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === 'thesis-files');
    
    if (bucketExists) {
      console.log('Bucket "thesis-files" already exists');
      return;
    }
    
    // Create the bucket
    const { error } = await supabase.storage.createBucket('thesis-files', {
      public: true
    });
    
    if (error) {
      throw error;
    }
    
    console.log('Created bucket "thesis-files"');
    
    // Set up public access to the bucket
    const { error: policyError } = await supabase.storage.from('thesis-files').createSignedUrl('dummy.pdf', 3600);
    
    if (policyError && !policyError.message.includes('not found')) {
      console.error('Error setting up bucket policy:', policyError);
    }
    
    console.log('Bucket "thesis-files" is ready');
  } catch (error) {
    console.error('Error creating storage bucket:', error);
  }
}
