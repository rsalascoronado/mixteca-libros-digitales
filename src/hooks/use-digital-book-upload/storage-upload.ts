
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
  try {
    // Bypass authentication check in development mode or for testing
    const isDevelopmentMode = true; 
    
    let appUser: User | null = null;
    
    if (!isDevelopmentMode) {
      const { data: { user: supabaseUser }, error: sessionError } = await supabase.auth.getUser();
      
      if (sessionError) {
        toast({
          title: 'Error de autenticación',
          description: 'No se pudo verificar la sesión del usuario.',
          variant: 'destructive'
        });
        throw new Error('Error de autenticación');
      }
      
      if (!supabaseUser) {
        toast({
          title: 'Usuario no autenticado',
          description: 'Debe iniciar sesión para subir archivos digitales.',
          variant: 'destructive'
        });
        throw new Error('Usuario no autenticado');
      }

      appUser = mapSupabaseUserToAppUser(supabaseUser);
      
      // Verificar rol de bibliotecario
      if (!isLibrarian(appUser)) {
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

    // Verificar existencia del bucket
    try {
      await supabase.storage.getBucket(bucketName);
    } catch (error) {
      // Si el bucket no existe, lanzar un error específico
      toast({
        title: 'Error de almacenamiento',
        description: `El bucket "${bucketName}" no está configurado correctamente.`,
        variant: 'destructive'
      });
      throw new Error(`Bucket "${bucketName}" no encontrado`);
    }

    // Subir archivo
    const { data, error: uploadError } = await uploadFile(bucketName, fileName, file);
    
    if (uploadError) {
      toast({
        title: 'Error de subida',
        description: uploadError.message || 'No se pudo subir el archivo.',
        variant: 'destructive'
      });
      throw uploadError;
    }

    // Obtener URL pública
    const publicUrl = getPublicUrl(bucketName, fileName);
    
    if (!publicUrl) {
      toast({
        title: 'Error de URL',
        description: 'No se pudo obtener la URL pública del archivo.',
        variant: 'destructive'
      });
      throw new Error('No se pudo obtener la URL del archivo');
    }

    return { publicUrl, error: null };
    
  } catch (err) {
    console.error('Error en la carga:', err);
    
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
    
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
