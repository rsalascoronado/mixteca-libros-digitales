
import { useState, useCallback, useMemo } from 'react';
import { Book, BookCategory } from '@/types';
import { DigitalBook } from '@/types/digitalBook';
import { useToast } from '@/hooks/use-toast';
import { mockBooks, mockCategories } from '@/types';
import { mockDigitalBooks } from '@/types/digitalBook';
import { supabase } from '@/integrations/supabase/client';

export function useBooksManagement() {
  const [categories, setCategories] = useState(mockCategories);
  const [books, setBooks] = useState(mockBooks);
  const [digitalBooks, setDigitalBooks] = useState(mockDigitalBooks);
  const { toast } = useToast();

  const categoriesByName = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.nombre] = category;
      return acc;
    }, {} as Record<string, BookCategory>);
  }, [categories]);

  const booksById = useMemo(() => {
    return books.reduce((acc, book) => {
      acc[book.id] = book;
      return acc;
    }, {} as Record<string, Book>);
  }, [books]);

  const handleAddCategoria = useCallback((categoria: { nombre: string; descripcion?: string }) => {
    const newCategoria = {
      id: Math.random().toString(36).substr(2, 9),
      ...categoria
    };
    setCategories(prev => [...prev, newCategoria]);
    toast({
      title: "Categoría agregada",
      description: `La categoría "${categoria.nombre}" ha sido agregada exitosamente.`
    });
  }, [toast]);

  const handleDeleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada exitosamente."
    });
  }, [toast]);

  const handleEditCategory = useCallback((id: string, categoria: Omit<BookCategory, 'id'>) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, ...categoria } : cat
    ));
    toast({
      title: "Categoría actualizada",
      description: `La categoría "${categoria.nombre}" ha sido actualizada exitosamente.`
    });
  }, [toast]);

  const handleDeleteBook = useCallback((id: string) => {
    // First delete any digital books associated with this book
    setDigitalBooks(prev => prev.filter(db => db.bookId !== id));
    // Then delete the book
    setBooks(prev => prev.filter(book => book.id !== id));
    toast({
      title: "Libro eliminado",
      description: "El libro ha sido eliminado exitosamente."
    });
  }, [toast]);

  const handleEditBook = useCallback((id: string, bookData: Partial<Book>) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, ...bookData } : book
    ));
    toast({
      title: "Libro actualizado",
      description: "Los cambios han sido guardados exitosamente."
    });
  }, [toast]);

  const handleAddBook = useCallback((book: Book) => {
    setBooks(prev => [...prev, book]);
    toast({
      title: "Libro agregado",
      description: "El libro ha sido agregado exitosamente."
    });
  }, [toast]);

  const handleAddDigitalBook = useCallback(async (bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => {
    try {
      // Validate that book exists
      const book = books.find(b => b.id === bookId);
      if (!book) {
        toast({
          title: "Error",
          description: "El libro seleccionado no existe.",
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
      
      // In a real application, we would save to the database here
      // For now, we're just updating the local state
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
  }, [books, toast]);

  const handleDeleteDigitalBook = useCallback(async (id: string) => {
    try {
      const bookToDelete = digitalBooks.find(db => db.id === id);
      
      if (bookToDelete?.storage_path) {
        try {
          const { error: storageError } = await supabase.storage
            .from('digital-books')
            .remove([bookToDelete.storage_path]);
            
          if (storageError) {
            console.error('Error eliminando archivo de storage:', storageError);
          }
        } catch (error) {
          console.error('Error al acceder al storage:', error);
          // Continue with deletion even if storage removal fails
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
      // Update digital book in state
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
    books,
    categories,
    digitalBooks,
    categoriesByName,
    booksById,
    handleAddCategoria,
    handleDeleteCategory,
    handleEditCategory,
    handleDeleteBook,
    handleEditBook,
    handleAddBook,
    handleAddDigitalBook,
    handleDeleteDigitalBook,
    handleEditDigitalBook
  };
}
