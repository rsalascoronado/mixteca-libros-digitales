
import { useAuth } from '@/contexts/AuthContext';
import { canSkipAuthForLibraryActions } from '@/lib/user-utils';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useUploadAuthCheck() {
  const { user } = useAuth();

  const checkUploadAuth = async () => {
    try {
      // Verificar sesión
      const { data: sessionData } = await supabase.auth.getSession();
      const isAuthenticated = !!sessionData.session;
      
      console.log("Estado de autenticación:", isAuthenticated ? "Autenticado" : "No autenticado");
      console.log("Usuario actual:", user ? `Rol: ${user.role}` : "No hay datos de usuario en el contexto");
      
      // Permitir acceso si está autenticado o puede omitir autenticación
      const canSkipAuth = canSkipAuthForLibraryActions(user);
      
      if (!isAuthenticated && !canSkipAuth) {
        toast({
          title: "Error de autenticación",
          description: "Debes iniciar sesión para subir archivos digitales",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      toast({
        title: "Error",
        description: "No se pudo verificar la autenticación. Intente nuevamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  return { checkUploadAuth };
}
