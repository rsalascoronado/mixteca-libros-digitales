
import { useState, useCallback, useMemo } from 'react';
import { Book, BookCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { mockBooks } from '@/types';
import { useCategoriesManagement } from './use-categories-management';
import { useDigitalBooksManagement } from './use-digital-books-management';

export function useBooksManagement() {
  const [books, setBooks] = useState(mockBooks);
  const { toast } = useToast();
  const {
    categories,
    handleAddCategoria,
    handleDeleteCategory,
    handleEditCategory
  } = useCategoriesManagement();

  const {
    digitalBooks,
    handleAddDigitalBook,
    handleDeleteDigitalBook,
    handleEditDigitalBook
  } = useDigitalBooksManagement();

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

  const handleDeleteBook = useCallback((id: string) => {
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
