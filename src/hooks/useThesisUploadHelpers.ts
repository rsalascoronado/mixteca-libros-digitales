
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { createBucketIfNotExists } from '@/utils/supabaseStorage';
import { isStaffUser } from '@/lib/user-utils';

export const useThesisUploadHelpers = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadThesisFile = async (
    file: File,
    setUploadProgress: React.Dispatch<React.SetStateAction<number>>,
    setIsUploading: (val: boolean) => void
  ): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validar tipo PDF
      if (!file.type.includes('pdf')) {
        setIsUploading(false);
        throw new Error('El archivo debe ser un PDF');
      }

      // Verificar si el usuario es staff o si estamos en modo desarrollo
      const isDevelopmentMode = import.meta.env.DEV || import.meta.env.MODE === 'development';
      const userIsStaff = isStaffUser(user);
      const canUpload = userIsStaff || isDevelopmentMode;

      console.log("Verificación de permisos para carga:", {
        isDev: isDevelopmentMode,
        isStaff: userIsStaff,
        canUpload
      });

      if (!canUpload) {
        setIsUploading(false);
        toast({
          title: "Acceso denegado",
          description: "Solo administradores o bibliotecarios pueden subir archivos de tesis.",
          variant: "destructive"
        });
        throw new Error('Solo administradores o bibliotecarios pueden subir archivos de tesis');
      }

      // Crear bucket si no existe
      await createBucketIfNotExists('thesis-files');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `thesis-${Date.now()}.${fileExt}`;

      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = Math.min(prev + 5, 95);
          return newProgress;
        });
      }, 300);

      try {
        console.log("Iniciando carga de archivo de tesis:", fileName);
        
        // Usando opciones de cacheControl y upsert para mejorar la carga
        const { data, error } = await supabase.storage
          .from('thesis-files')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
          });

        clearInterval(progressInterval);

        if (error) {
          console.error("Error subiendo archivo de tesis:", error);
          throw new Error(`Error subiendo el archivo: ${error.message}`);
        }

        // Obtener URL pública
        const { data: { publicUrl } } = supabase.storage
          .from('thesis-files')
          .getPublicUrl(data?.path || fileName);

        if (!publicUrl) {
          throw new Error('No se pudo obtener la URL pública del archivo');
        }

        console.log("Tesis cargada exitosamente:", publicUrl);
        setUploadProgress(100);
        return publicUrl;
      } catch (error: any) {
        throw error;
      } finally {
        clearInterval(progressInterval);
        setTimeout(() => {
          setIsUploading(false);
        }, 500);
      }
    } catch (error: any) {
      console.error("Error en uploadThesisFile:", error);
      setIsUploading(false);
      setUploadProgress(0);
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo subir el archivo',
        variant: 'destructive'
      });
      throw error;
    }
  };

  const deleteThesisFile = async (fileUrl: string) => {
    try {
      if (!fileUrl) {
        console.warn("Se intentó eliminar un archivo sin URL");
        return;
      }
      
      // Verificar si el usuario es staff o si estamos en modo desarrollo
      const isDevelopmentMode = import.meta.env.DEV || import.meta.env.MODE === 'development';
      const userIsStaff = isStaffUser(user);
      const canDelete = userIsStaff || isDevelopmentMode;

      if (!canDelete) {
        toast({
          title: "Acceso denegado",
          description: "Solo administradores o bibliotecarios pueden eliminar archivos de tesis.",
          variant: "destructive"
        });
        throw new Error('Solo administradores o bibliotecarios pueden eliminar archivos de tesis');
      }

      // Extraer nombre
      let fileName = '';
      
      try {
        if (fileUrl.includes('/')) {
          const urlParts = fileUrl.split('/');
          fileName = urlParts[urlParts.length - 1];
        } else {
          fileName = fileUrl;
        }
      } catch (error) {
        console.error("Error extrayendo nombre de archivo:", error);
        fileName = fileUrl;
      }
      
      if (!fileName) {
        console.warn("No se pudo extraer nombre de archivo:", fileUrl);
        return;
      }

      console.log("Intentando eliminar archivo:", fileName);
      
      const { error } = await supabase.storage
        .from('thesis-files')
        .remove([fileName]);
        
      if (error) {
        console.error("Error eliminando archivo de tesis:", error);
        toast({
          title: 'Error',
          description: error.message || 'No se pudo eliminar el archivo',
          variant: 'destructive'
        });
      } else {
        console.log("Archivo de tesis eliminado exitosamente");
      }
    } catch (error) {
      console.error("Error en deleteThesisFile:", error);
    }
  };

  return {
    uploadThesisFile,
    deleteThesisFile
  };
};
