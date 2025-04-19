
import React from 'react';
import { Book, BookCategory } from '@/types';
import { DigitalBook } from '@/types/digitalBook';
import { useToast } from '@/hooks/use-toast';
import { mockBooks, mockCategories } from '@/types';
import { mockDigitalBooks } from '@/types/digitalBook';

export function useBooksManagement() {
  const [categories, setCategories] = React.useState(mockCategories);
  const [books, setBooks] = React.useState(mockBooks);
  const [digitalBooks, setDigitalBooks] = React.useState(mockDigitalBooks);
  const { toast } = useToast();

  const handleAddCategoria = (categoria: { nombre: string; descripcion?: string }) => {
    const newCategoria = {
      id: Math.random().toString(36).substr(2, 9),
      ...categoria
    };
    setCategories([...categories, newCategoria]);
    toast({
      title: "Categoría agregada",
      description: `La categoría "${categoria.nombre}" ha sido agregada exitosamente.`
    });
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada exitosamente."
    });
  };

  const handleEditCategory = (id: string, categoria: Omit<BookCategory, 'id'>) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, ...categoria } : cat
    ));
    toast({
      title: "Categoría actualizada",
      description: `La categoría "${categoria.nombre}" ha sido actualizada exitosamente.`
    });
  };

  const handleDeleteBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
    toast({
      title: "Libro eliminado",
      description: "El libro ha sido eliminado exitosamente."
    });
  };

  const handleEditBook = (id: string, bookData: Partial<Book>) => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, ...bookData } : book
    ));
    toast({
      title: "Libro actualizado",
      description: "Los cambios han sido guardados exitosamente."
    });
  };

  const handleAddBook = (book: Book) => {
    setBooks([...books, book]);
    toast({
      title: "Libro agregado",
      description: "El libro ha sido agregado exitosamente."
    });
  };

  const handleAddDigitalBook = (bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => {
    const newDigitalBook: DigitalBook = {
      id: Math.random().toString(36).substr(2, 9),
      bookId,
      fechaSubida: new Date(),
      ...data
    };
    setDigitalBooks([...digitalBooks, newDigitalBook]);
    toast({
      title: "Archivo digital agregado",
      description: `Se ha agregado una versión ${data.formato} al libro correctamente.`
    });
  };

  const handleDeleteDigitalBook = (id: string) => {
    setDigitalBooks(digitalBooks.filter(db => db.id !== id));
    toast({
      title: "Archivo digital eliminado",
      description: "El archivo digital ha sido eliminado exitosamente."
    });
  };

  return {
    books,
    categories,
    digitalBooks,
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
