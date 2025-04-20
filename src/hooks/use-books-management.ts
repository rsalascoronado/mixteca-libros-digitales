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
    setBooks(prev => prev.filter(book => book.id !== id));
    setDigitalBooks(prev => prev.filter(db => db.bookId !== id));
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
  }, [toast]);

  const handleDeleteDigitalBook = useCallback(async (id: string) => {
    try {
      const bookToDelete = digitalBooks.find(db => db.id === id);
      
      if (bookToDelete?.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('digital-books')
          .remove([bookToDelete.storage_path]);
          
        if (storageError) throw storageError;
      }
      
      setDigitalBooks(prev => prev.filter(db => db.id !== id));
      
      toast({
        title: "Archivo digital eliminado",
        description: "El archivo digital ha sido eliminado exitosamente."
      });
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el archivo digital.",
        variant: "destructive"
      });
    }
  }, [digitalBooks, toast]);

  const handleEditDigitalBook = useCallback(async (id: string, data: Partial<DigitalBook>) => {
    try {
      setDigitalBooks(prev => prev.map(db => 
        db.id === id ? { ...db, ...data } : db
      ));
      
      const digitalBook = digitalBooks.find(db => db.id === id);
      if (digitalBook?.storage_path && data.formato && digitalBook.formato !== data.formato) {
        console.log('Formato cambiado, en un entorno de producción se actualizaría el archivo');
      }
      
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
  }, [digitalBooks, toast]);

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
