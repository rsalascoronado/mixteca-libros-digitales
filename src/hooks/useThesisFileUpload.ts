
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useThesisFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();
  
  const uploadThesisFile = async (file: File, thesisId?: string): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Validar que el archivo sea un PDF
      if (!file.type.includes('pdf')) {
        throw new Error('El archivo debe ser un PDF');
      }
      
      // Generar un nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `thesis-${thesisId || Date.now()}.${fileExt}`;
      
      // Custom upload progress handling
      const xhr = new XMLHttpRequest();
      let uploadUrl = '';

      // Set up progress monitoring
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentage);
        }
      });

      // Upload the file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('thesis-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      // Obtain the public URL of the file
      const { data: { publicUrl } } = supabase.storage
        .from('thesis-files')
        .getPublicUrl(data?.path || fileName);
      
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
  
  // Function to delete a file from Supabase Storage
  const deleteThesisFile = async (fileUrl: string): Promise<void> => {
    try {
      // Extract the filename from the URL
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      // Delete the file from Supabase Storage
      const { error } = await supabase.storage
        .from('thesis-files')
        .remove([fileName]);
      
      if (error) {
        throw error;
      }
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
  
  return {
    uploadThesisFile,
    deleteThesisFile,
    isUploading,
    uploadProgress
  };
};
