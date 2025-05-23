
import { useToast } from '@/hooks/use-toast';
import { useThesisUploadHelpers } from './useThesisUploadHelpers';
import type { Thesis } from '@/types';
import { saveThesis } from '@/lib/theses-db';
import { useAuth } from '@/contexts/AuthContext';
import { isStaffUser } from '@/lib/user-utils';

export const useSaveThesisWithFile = (
  setUploadProgress: (val: number) => void,
  setIsUploading: (val: boolean) => void
) => {
  const { toast } = useToast();
  const { uploadThesisFile, deleteThesisFile } = useThesisUploadHelpers();
  const { user } = useAuth();

  const saveThesisWithFile = async (thesis: Partial<Thesis>, file?: File): Promise<Thesis> => {
    try {
      // Verificar primero si estamos en modo de desarrollo
      const isDevMode = import.meta.env.DEV || import.meta.env.MODE === 'development';
      
      // Verificar permisos: o está autenticado, o es staff, o estamos en modo desarrollo
      const isUserStaff = isStaffUser(user);
      const canSkipAuth = isDevMode || isUserStaff;
      
      console.log("Verificación de permisos:", {
        isStaff: isUserStaff,
        isDev: isDevMode,
        canSkip: canSkipAuth
      });
      
      // Solo verificar la autenticación si no es staff y no estamos en desarrollo
      if (!canSkipAuth) {
        // Verificar autenticación
        const { data: authData } = await import("@/integrations/supabase/client").then(m => m.supabase.auth.getSession());
        
        if (!authData.session) {
          toast({
            title: "Error de autenticación",
            description: "Debes iniciar sesión para guardar tesis",
            variant: "destructive"
          });
          throw new Error('Debes iniciar sesión para guardar tesis');
        }
      }

      let publicUrl = thesis.archivoPdf || null;
      
      // Subir nuevo archivo si es necesario
      if (file) {
        try {
          setIsUploading(true);
          publicUrl = await uploadThesisFile(file, setUploadProgress, setIsUploading);
        } catch (uploadError: any) {
          setIsUploading(false);
          throw new Error(uploadError?.message || 'Error subiendo archivo');
        }
      }

      // Guardar en base de datos
      const thesisToSave: Thesis = {
        id: thesis.id || '',
        titulo: thesis.titulo || '',
        autor: thesis.autor || '',
        carrera: thesis.carrera || '',
        anio: thesis.anio || new Date().getFullYear(),
        director: thesis.director || '',
        tipo: thesis.tipo as 'Licenciatura' | 'Maestría' | 'Doctorado',
        disponible: thesis.disponible !== false,
        resumen: thesis.resumen,
        archivoPdf: publicUrl
      };

      try {
        console.log("Guardando tesis en la base de datos:", thesisToSave);
        const savedThesis = await saveThesis(thesisToSave);
        console.log("Tesis guardada exitosamente:", savedThesis);
        return savedThesis;
      } catch (dbError: any) {
        console.error("Error guardando tesis:", dbError);
        
        // Si hubo error y habíamos subido un archivo, intentar eliminarlo
        if (file && publicUrl && publicUrl !== thesis.archivoPdf) {
          try { 
            await deleteThesisFile(publicUrl); 
          } catch (deleteError) { 
            console.warn("No se pudo eliminar el archivo tras error:", deleteError);
          }
        }
        
        toast({
          title: 'Error',
          description: dbError instanceof Error ? dbError.message : 'No se pudo guardar la tesis con el archivo',
          variant: 'destructive'
        });
        throw dbError;
      } finally {
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error general en saveThesisWithFile:", error);
      setIsUploading(false);
      throw error;
    }
  };

  return { saveThesisWithFile };
};
