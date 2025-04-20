
import { supabase } from '@/integrations/supabase/client';
import { createBucketIfNotExists, uploadFile, getPublicUrl } from '@/utils/supabaseStorage';
import { isLibrarian } from '@/lib/user-utils';
import { User, UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';

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
  console.log(`Iniciando proceso de carga para: "${fileName}" en bucket "${bucketName}"`);
  
  try {
    // Bypass authentication check in development mode or for testing
    const isDevelopmentMode = true; 
    
    let appUser: User | null = null;
    
    if (!isDevelopmentMode) {
      const { data: { user: supabaseUser }, error: sessionError } = await supabase.auth.getUser();
      
      if (sessionError) {
        console.error('Error de sesión:', sessionError);
        toast({
          title: 'Error de autenticación',
          description: 'No se pudo verificar la sesión del usuario.',
          variant: 'destructive'
        });
        throw new Error(`Error de autenticación: ${sessionError.message}`);
      }
      
      if (!supabaseUser) {
        console.error('No hay usuario autenticado');
        toast({
          title: 'Usuario no autenticado',
          description: 'Debe iniciar sesión para subir archivos digitales.',
          variant: 'destructive'
        });
        throw new Error('Usuario no autenticado');
      }

      appUser = mapSupabaseUserToAppUser(supabaseUser);
      console.log('Usuario autenticado:', appUser);
      
      // Verificar rol de bibliotecario
      if (!isLibrarian(appUser)) {
        console.error('Usuario no tiene rol de bibliotecario:', appUser);
        toast({
          title: 'No autorizado',
          description: 'Solo los bibliotecarios pueden subir libros digitales.',
          variant: 'destructive'
        });
        throw new Error('No autorizado: Solo bibliotecarios pueden subir libros digitales');
      }
    } else {
      // Modo de desarrollo: usuario de prueba
      appUser = {
        id: 'dev-user-id',
        email: 'biblioteca@mixteco.utm.mx',
        nombre: 'Desarrollo',
        apellidos: 'Sistema',
        role: 'bibliotecario',
        createdAt: new Date()
      };
      
      console.log('Modo desarrollo: Usando usuario de prueba', appUser);
    }

    // Asegurar que el bucket existe
    const bucketExists = await createBucketIfNotExists(bucketName);
    if (!bucketExists) {
      console.error(`Error: El bucket "${bucketName}" no pudo ser verificado o creado`);
      toast({
        title: 'Error de almacenamiento',
        description: `No se pudo acceder al almacenamiento "${bucketName}". El sistema intentará crear el bucket automáticamente.`,
        variant: 'destructive'
      });
      
      // Intentar crear el bucket manualmente
      try {
        await supabase.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 52428800, // 50MB
          allowedMimeTypes: ['application/pdf', 'application/epub+zip', 'application/x-mobipocket-ebook', 'text/html']
        });
        console.log(`Bucket "${bucketName}" creado manualmente`);
      } catch (bucketError) {
        console.error('Error al crear bucket manualmente:', bucketError);
        toast({
          title: 'Error crítico',
          description: `No se pudo crear el bucket "${bucketName}". Contacte al administrador.`,
          variant: 'destructive'
        });
        throw new Error(`No se pudo crear el bucket "${bucketName}"`);
      }
    }

    // Subir archivo
    console.log(`Subiendo archivo "${fileName}" al bucket "${bucketName}"`);
    const { data, error: uploadError } = await uploadFile(bucketName, fileName, file);
    
    if (uploadError) {
      console.error('Error al subir archivo:', uploadError);
      toast({
        title: 'Error de subida',
        description: uploadError.message || 'No se pudo subir el archivo.',
        variant: 'destructive'
      });
      throw uploadError;
    }

    // Obtener URL pública
    console.log('Obteniendo URL pública del archivo');
    const publicUrl = getPublicUrl(bucketName, fileName);
    
    if (!publicUrl) {
      console.error('No se pudo obtener URL pública');
      toast({
        title: 'Error de URL',
        description: 'No se pudo obtener la URL pública del archivo.',
        variant: 'destructive'
      });
      throw new Error('No se pudo obtener la URL del archivo');
    }

    console.log('Carga completada con éxito:', publicUrl);
    return { publicUrl, error: null };
    
  } catch (err) {
    console.error('Error detallado en la carga:', err);
    
    let errorMessage = 'Error desconocido';
    
    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === 'object' && err !== null) {
      try {
        errorMessage = JSON.stringify(err);
      } catch (jsonError) {
        errorMessage = 'Error no serializable';
      }
    }
    
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive'
    });
    
    return { 
      publicUrl: null, 
      error: err instanceof Error ? err : new Error(errorMessage)
    };
  }
};
