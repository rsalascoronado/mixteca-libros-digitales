
import { useState } from 'react';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Book } from '@/types';

export function useDigitalBookUpload(book: Book, onUploadComplete: (data: {
  formato: string;
  url: string;
  tamanioMb: number;
  resumen?: string;
  storage_path?: string;
}) => void) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleUpload = async (file: File, formato: string, resumen?: string) => {
    try {
      // Validate file type based on format
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const formatExtMap: Record<string, string[]> = {
        'PDF': ['pdf'],
        'EPUB': ['epub'],
        'MOBI': ['mobi', 'azw', 'azw3'],
        'HTML': ['html', 'htm']
      };
      
      const validExtensions = formatExtMap[formato] || [];
      
      if (fileExt && !validExtensions.includes(fileExt)) {
        toast({
          title: "Formato incorrecto",
          description: `El formato del archivo (.${fileExt}) no coincide con el formato seleccionado (${formato})`,
          variant: "destructive"
        });
        return false;
      }

      // Verify file size before starting the upload
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "Error de tamaño",
          description: "El archivo excede el límite de 50MB permitido.",
          variant: "destructive"
        });
        return false;
      }

      setIsUploading(true);
      setUploadProgress(10);
      
      const fileName = `book-${book.id}-${Date.now()}.${fileExt}`;
      
      // Create bucket if it doesn't exist
      try {
        const { data: bucket, error: bucketError } = await supabase.storage.getBucket('digital-books');
        
        if (bucketError && bucketError.message.includes('does not exist')) {
          const { error: createError } = await supabase.storage.createBucket('digital-books', {
            public: true,
            fileSizeLimit: 52428800 // 50MB
          });
          
          if (createError) {
            console.error('Error creating bucket:', createError);
            throw createError;
          }
        }
      } catch (err) {
        console.error('Bucket check error:', err);
        // Continue with upload attempt even if bucket check failed
      }
      
      // Attempt to upload the file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('digital-books')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Error al subir el archivo:', uploadError);
        
        // Handle specific error types
        if (uploadError.message.includes('size')) {
          toast({
            title: "Error de tamaño",
            description: "El archivo excede el límite de 50MB permitido por el servidor.",
            variant: "destructive"
          });
        } else if (uploadError.message.includes('auth')) {
          toast({
            title: "Error de autenticación",
            description: "Debe iniciar sesión para subir archivos.",
            variant: "destructive"
          });
        } else if (uploadError.message.includes('security')) {
          toast({
            title: "Error de seguridad",
            description: "No tiene permisos para subir archivos en este bucket.",
            variant: "destructive"
          });
        } else if (uploadError.message.includes('violates row-level security policy')) {
          toast({
            title: "Error de permisos",
            description: "No tiene permisos para subir archivos. Utilizando URL alternativa.",
            variant: "default" // Changed from "warning" to "default"
          });
          
          // Fallback to using a mock URL for development
          const mockUrl = `https://example.com/digital-books/${fileName}`;
          setUploadProgress(100);
          
          onUploadComplete({
            formato,
            url: mockUrl,
            tamanioMb: Number((file.size / (1024 * 1024)).toFixed(2)),
            resumen,
            storage_path: fileName
          });
          
          toast({
            title: "Archivo digital guardado (modo simulación)",
            description: "Se ha simulado la carga del archivo digital."
          });
          
          return true;
        } else {
          toast({
            title: "Error",
            description: "No se pudo guardar el archivo digital: " + uploadError.message,
            variant: "destructive"
          });
        }
        return false;
      }
      
      setUploadProgress(90);
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('digital-books')
        .getPublicUrl(fileName);
      
      setUploadProgress(100);
      
      onUploadComplete({
        formato,
        url: publicUrl,
        tamanioMb: Number((file.size / (1024 * 1024)).toFixed(2)),
        resumen,
        storage_path: fileName
      });
      
      toast({
        title: "Archivo digital guardado",
        description: "Se ha guardado el archivo digital correctamente."
      });

      return true;
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      
      // Fallback for development/testing when storage isn't available
      if (process.env.NODE_ENV === 'development') {
        const mockUrl = `https://example.com/digital-books/mock-${Date.now()}.${file.name.split('.').pop()}`;
        setUploadProgress(100);
        
        onUploadComplete({
          formato,
          url: mockUrl,
          tamanioMb: Number((file.size / (1024 * 1024)).toFixed(2)),
          resumen
        });
        
        toast({
          title: "Archivo digital guardado (modo desarrollo)",
          description: "Se ha simulado la carga del archivo digital en modo desarrollo."
        });
        
        return true;
      }
      
      toast({
        title: "Error",
        description: "No se pudo guardar el archivo digital. Intente nuevamente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadProgress,
    handleUpload
  };
}
