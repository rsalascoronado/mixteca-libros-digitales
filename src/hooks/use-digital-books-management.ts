
import { useState, useCallback } from 'react';
import { DigitalBook } from '@/types/digitalBook';
import { useToast } from '@/hooks/use-toast';
import { mockDigitalBooks } from '@/types/digitalBook';
import { supabase } from '@/integrations/supabase/client';
import { deleteFile } from '@/utils/supabaseStorage';

export function useDigitalBooksManagement() {
  const [digitalBooks, setDigitalBooks] = useState(mockDigitalBooks);
  const { toast } = useToast();

  const handleAddDigitalBook = useCallback(async (bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error de autenticación",
          description: "Debe iniciar sesión para agregar libros digitales.",
          variant: "destructive"
        });
        return;
      }

      const newDigitalBook: DigitalBook = {
        id: Math.random().toString(36).substr(2, 9),
        bookId,
        fechaSubida: new Date(),
        ...data
      };
      
      setDigitalBooks(prev => [...prev, newDigitalBook]);
      
      toast({
        title: "Archivo digital agregado",
        description: `Se ha agregado una versión ${data.formato} al libro correctamente.`
      });
      
      return newDigitalBook;
    } catch (error) {
      console.error('Error al agregar libro digital:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el archivo digital. Intente nuevamente.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleDeleteDigitalBook = useCallback(async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error de autenticación",
          description: "Debe iniciar sesión para eliminar libros digitales.",
          variant: "destructive"
        });
        return false;
      }

      const bookToDelete = digitalBooks.find(db => db.id === id);
      
      if (bookToDelete?.storage_path) {
        try {
          const { error: storageError } = await deleteFile('digital-books', bookToDelete.storage_path);
            
          if (storageError) {
            console.error('Error eliminando archivo de storage:', storageError);
          }
        } catch (error) {
          console.error('Error al acceder al storage:', error);
        }
      }
      
      setDigitalBooks(prev => prev.filter(db => db.id !== id));
      
      toast({
        title: "Archivo digital eliminado",
        description: "El archivo digital ha sido eliminado exitosamente."
      });
      
      return true;
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el archivo digital.",
        variant: "destructive"
      });
      return false;
    }
  }, [digitalBooks, toast]);

  const handleEditDigitalBook = useCallback(async (id: string, data: Partial<DigitalBook>) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error de autenticación",
          description: "Debe iniciar sesión para editar libros digitales.",
          variant: "destructive"
        });
        return false;
      }

      setDigitalBooks(prev => prev.map(db => 
        db.id === id ? { ...db, ...data } : db
      ));
      
      toast({
        title: "Archivo digital actualizado",
        description: "Los cambios han sido guardados exitosamente."
      });
      
      return true;
    } catch (error) {
      console.error('Error al actualizar el archivo digital:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el archivo digital.",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  return {
    digitalBooks,
    handleAddDigitalBook,
    handleDeleteDigitalBook,
    handleEditDigitalBook,
  };
}
