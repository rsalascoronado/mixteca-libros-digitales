
import { supabase } from '@/integrations/supabase/client';

export async function createThesisStorageBucket() {
  try {
    // Check if user is authenticated first - use getSession for most up-to-date status
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Error checking authentication:', authError);
      throw new Error(`Error de autenticación: ${authError.message}`);
    }
    
    if (!authData.session) {
      console.log('Usuario no autenticado. No se puede crear el bucket de almacenamiento.');
      return;
    }
    
    // Check if the bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error al listar buckets:', listError);
      return;
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === 'thesis-files');
    
    if (bucketExists) {
      console.log('Bucket "thesis-files" ya existe');
      return;
    }
    
    // Create the bucket
    const { error } = await supabase.storage.createBucket('thesis-files', {
      public: true
    });
    
    if (error) {
      if (error.message.includes('row-level security policy')) {
        console.error('Error de seguridad al crear bucket. El usuario no tiene permisos suficientes.');
      } else {
        console.error('Error al crear bucket:', error);
      }
      return;
    }
    
    console.log('Created bucket "thesis-files"');
    
    // Set up public access to the bucket
    const { error: policyError } = await supabase.storage.from('thesis-files').createSignedUrl('dummy.pdf', 3600);
    
    if (policyError && !policyError.message.includes('not found')) {
      console.error('Error al configurar política del bucket:', policyError);
    }
    
    console.log('Bucket "thesis-files" está listo');
  } catch (error) {
    console.error('Error al crear bucket de almacenamiento:', error);
  }
}
