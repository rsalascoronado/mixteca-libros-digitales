
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useThesisUploadHelpers } from './useThesisUploadHelpers';
import { useSaveThesisWithFile } from './useSaveThesisWithFile';

export const useThesisFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  // Helpers: subir/eliminar archivos
  const { uploadThesisFile, deleteThesisFile } = useThesisUploadHelpers();

  // Guardar tesis + archivo
  const { saveThesisWithFile } = useSaveThesisWithFile(setUploadProgress, setIsUploading);

  // Comprobación de sesión, sólo para efectos de UI
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    // Verificar sesión al iniciar
    const checkSession = async () => {
      try {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data } = await supabase.auth.getSession();
        setSessionChecked(!!data.session);
      } catch (error) {
        console.error("Error checking session:", error);
        setSessionChecked(false);
      }
    };

    checkSession();
  }, []);

  return {
    uploadThesisFile: async (file: File) => uploadThesisFile(file, setUploadProgress, setIsUploading),
    deleteThesisFile,
    saveThesisWithFile,
    isUploading,
    uploadProgress,
    sessionChecked
  };
};
