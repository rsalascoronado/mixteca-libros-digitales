
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { saveThesis, deleteThesis } from '@/lib/theses-db';
import { Thesis } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const useThesisFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  // Check authentication status on mount
  const [sessionChecked, setSessionChecked] = useState(false);
  
  useEffect(() => {
    // Verify session on hook initialization
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSessionChecked(!!data.session);
    };
    
    checkSession();
  }, []);
  
  const uploadThesisFile = async (file: File): Promise<string> => {
    // Verify authentication status before proceeding
    const { data: authData } = await supabase.auth.getSession();
    if (!authData.session) {
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para subir archivos",
        variant: "destructive"
      });
      throw new Error('Debes iniciar sesión para subir archivos');
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Validar que el archivo sea un PDF
      if (!file.type.includes('pdf')) {
        throw new Error('El archivo debe ser un PDF');
      }
      
      // Generar un nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `thesis-${Date.now()}.${fileExt}`;
      
      // Simular progreso de carga
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 500);
      
      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('thesis-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      clearInterval(progressInterval);
      
      if (error) {
        console.error('Error uploading file:', error);
        throw new Error(`Error subiendo el archivo: ${error.message}`);
      }
      
      // Get the public URL of the file
      const { data: { publicUrl } } = supabase.storage
        .from('thesis-files')
        .getPublicUrl(data?.path || fileName);
      
      if (!publicUrl) {
        throw new Error('No se pudo obtener la URL pública del archivo');
      }
      
      console.log('File uploaded successfully. Public URL:', publicUrl);
      setUploadProgress(100);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading thesis file:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo subir el archivo',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  };
  
  const deleteThesisFile = async (fileUrl: string): Promise<void> => {
    // Verify authentication status before proceeding
    const { data: authData } = await supabase.auth.getSession();
    if (!authData.session) {
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para eliminar archivos",
        variant: "destructive"
      });
      throw new Error('Debes iniciar sesión para eliminar archivos');
    }
    
    try {
      // Extract the filename from the URL
      const fileName = fileUrl.split('/').pop();
      
      if (!fileName) {
        throw new Error('No se pudo obtener el nombre del archivo');
      }
      
      // Delete the file from Supabase Storage
      const { error } = await supabase.storage
        .from('thesis-files')
        .remove([fileName]);
      
      if (error) {
        console.error('Error deleting file:', error);
        throw new Error(`Error eliminando el archivo: ${error.message}`);
      }
      
      console.log('File deleted successfully:', fileName);
    } catch (error) {
      console.error('Error deleting thesis file:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo eliminar el archivo',
        variant: 'destructive'
      });
      throw error;
    }
  };
  
  const saveThesisWithFile = async (thesis: Partial<Thesis>, file?: File): Promise<Thesis> => {
    // Verify authentication status before continuing
    const { data: authData } = await supabase.auth.getSession();
    if (!authData.session) {
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para guardar tesis",
        variant: "destructive"
      });
      throw new Error('Debes iniciar sesión para guardar tesis');
    }

    try {
      let publicUrl = thesis.archivoPdf || null;
      
      // Si hay un archivo nuevo, subir primero el archivo
      if (file) {
        try {
          publicUrl = await uploadThesisFile(file);
        } catch (uploadError) {
          console.error('Error en la carga del archivo:', uploadError);
          throw new Error(`Error en la carga del archivo: ${uploadError instanceof Error ? uploadError.message : 'Error desconocido'}`);
        }
      }
      
      // Crear el objeto de tesis completo
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
        // Guardar en la base de datos
        const savedThesis = await saveThesis(thesisToSave);
        return savedThesis;
      } catch (dbError) {
        console.error('Error al guardar en la base de datos:', dbError);
        
        // Si subimos un archivo pero fallamos al guardar en la base de datos,
        // intentamos eliminar el archivo para no dejar huérfanos
        if (file && publicUrl) {
          try {
            await deleteThesisFile(publicUrl);
            console.log('Archivo eliminado después del error de guardado en BD');
          } catch (cleanupError) {
            console.error('No se pudo limpiar el archivo después del error:', cleanupError);
          }
        }
        
        throw dbError;
      }
    } catch (error) {
      console.error('Error saving thesis with file:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo guardar la tesis con el archivo',
        variant: 'destructive'
      });
      throw error;
    }
  };
  
  return {
    uploadThesisFile,
    deleteThesisFile,
    saveThesisWithFile,
    isUploading,
    uploadProgress,
    sessionChecked
  };
};
