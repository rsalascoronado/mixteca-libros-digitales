
import { useState, useCallback, useMemo } from 'react';
import { Book, BookCategory } from '@/types';
import { DigitalBook } from '@/types/digitalBook';
import { useToast } from '@/hooks/use-toast';
import { mockBooks, mockCategories } from '@/types';
import { mockDigitalBooks } from '@/types/digitalBook';

export function useBooksManagement() {
  const [categories, setCategories] = useState(mockCategories);
  const [books, setBooks] = useState(mockBooks);
  const [digitalBooks, setDigitalBooks] = useState(mockDigitalBooks);
  const { toast } = useToast();

  // Memoize categorias por nombre para búsqueda rápida
  const categoriesByName = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.nombre] = category;
      return acc;
    }, {} as Record<string, BookCategory>);
  }, [categories]);

  // Memoize libros por id para búsqueda rápida
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
    // También eliminar libros digitales asociados
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

  const handleAddDigitalBook = useCallback((bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => {
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

  const handleDeleteDigitalBook = useCallback((id: string) => {
    setDigitalBooks(prev => prev.filter(db => db.id !== id));
    toast({
      title: "Archivo digital eliminado",
      description: "El archivo digital ha sido eliminado exitosamente."
    });
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
    handleDeleteDigitalBook
  };
}
