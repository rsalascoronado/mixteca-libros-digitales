
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { Book, BookCategory } from '@/types';
import { mockBooks, mockCategories } from '@/types/book';
import { DigitalBook } from '@/types/digitalBook';
import { mockDigitalBooks } from '@/types/digitalBook';
import { useBooksData } from '@/components/books/hooks/useBooksData';
import { useBooksRealtime } from '@/components/books/hooks/useBooksRealtime';

export const useBooksManagement = () => {
  const { toast } = useToast();
  const { books: initialBooks, digitalBooks: initialDigitalBooks, setBooks, setDigitalBooks } = useBooksData();
  const [books, setLocalBooks] = useState<Book[]>([]);
  const [digitalBooks, setLocalDigitalBooks] = useState<DigitalBook[]>([]);
  const [categories, setCategories] = useState<BookCategory[]>([]);
  
  // Subscribe to realtime updates
  useBooksRealtime(setBooks, setDigitalBooks);

  // Initialize local state from fetched data
  useEffect(() => {
    if (initialBooks.length > 0) {
      setLocalBooks(initialBooks);
    }
    
    // Fetch and set digital books
    const fetchDigitalBooks = async () => {
      try {
        const { data, error } = await supabase
          .from('digital_books')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const mappedDigitalBooks = data.map(item => ({
            id: item.id,
            bookId: item.book_id,
            formato: item.formato as 'PDF' | 'EPUB' | 'MOBI' | 'HTML',
            url: item.url,
            tamanioMb: item.tamanio_mb,
            fechaSubida: new Date(item.fecha_subida),
            resumen: item.resumen || undefined
          }));
          setLocalDigitalBooks(mappedDigitalBooks);
        } else {
          setLocalDigitalBooks(mockDigitalBooks);
        }
      } catch (error) {
        console.error('Error loading digital books:', error);
        setLocalDigitalBooks(mockDigitalBooks);
      }
    };
    
    // Fetch and set categories
    const fetchCategories = async () => {
      try {
        // Since we don't have a categories table yet, we'll extract unique categories from books
        const uniqueCategories = [...new Set(initialBooks.map(book => book.categoria))];
        const mappedCategories = uniqueCategories.map((category, index) => ({
          id: index.toString(),
          nombre: category,
          descripcion: `Categoría para libros de ${category}`
        }));
        
        setCategories(mappedCategories.length > 0 ? mappedCategories : mockCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategories(mockCategories);
      }
    };
    
    fetchDigitalBooks();
    fetchCategories();
  }, [initialBooks, initialDigitalBooks]);

  const handleAddCategoria = useCallback(async (newCategory: Omit<BookCategory, 'id'>) => {
    try {
      // Since book_categories table doesn't exist in the database, we'll use mock data for now
      // In the future, uncomment this code when the table is created
      // const { data, error } = await supabase
      //   .from('book_categories')
      //   .insert([newCategory])
      //   .select();

      // if (error) {
      //   console.error("Error adding category:", error);
      //   toast({
      //     title: "Error al agregar categoría",
      //     description: "No se pudo agregar la categoría. Intente nuevamente.",
      //     variant: "destructive",
      //   });
      //   return;
      // }

      // Mock implementation for now
      const newId = (categories.length + 1).toString();
      setCategories((prevCategories) => [...prevCategories, { ...newCategory, id: newId }]);
      
      toast({
        title: "Categoría agregada",
        description: `La categoría "${newCategory.nombre}" ha sido agregada exitosamente.`,
      });
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        title: "Error al agregar categoría",
        description: "No se pudo agregar la categoría. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast, categories]);

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    try {
      // Since book_categories table doesn't exist in the database, we'll use mock data for now
      // In the future, uncomment this code when the table is created
      // const { error } = await supabase
      //   .from('book_categories')
      //   .delete()
      //   .eq('id', categoryId);

      // if (error) {
      //   console.error("Error deleting category:", error);
      //   toast({
      //     title: "Error al eliminar categoría",
      //     description: "No se pudo eliminar la categoría. Intente nuevamente.",
      //     variant: "destructive",
      //   });
      //   return;
      // }

      // Mock implementation for now
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryId));
      
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada exitosamente.",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error al eliminar categoría",
        description: "No se pudo eliminar la categoría. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleEditCategory = useCallback(async (categoryId: string, updatedCategory: Partial<BookCategory>) => {
    try {
      // Since book_categories table doesn't exist in the database, we'll use mock data for now
      // In the future, uncomment this code when the table is created
      // const { error } = await supabase
      //   .from('book_categories')
      //   .update(updatedCategory)
      //   .eq('id', categoryId);

      // if (error) {
      //   console.error("Error editing category:", error);
      //   toast({
      //     title: "Error al editar categoría",
      //     description: "No se pudo editar la categoría. Intente nuevamente.",
      //     variant: "destructive",
      //   });
      //   return;
      // }

      // Mock implementation for now
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId ? { ...category, ...updatedCategory } : category
        )
      );
      
      toast({
        title: "Categoría editada",
        description: "La categoría ha sido editada exitosamente.",
      });
    } catch (error) {
      console.error("Error editing category:", error);
      toast({
        title: "Error al editar categoría",
        description: "No se pudo editar la categoría. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleDeleteBook = useCallback(async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) {
        console.error("Error deleting book:", error);
        toast({
          title: "Error al eliminar libro",
          description: "No se pudo eliminar el libro. Intente nuevamente.",
          variant: "destructive",
        });
        return;
      }

      setLocalBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
      toast({
        title: "Libro eliminado",
        description: "El libro ha sido eliminado exitosamente.",
      });
    } catch (error) {
      console.error("Error deleting book:", error);
      toast({
        title: "Error al eliminar libro",
        description: "No se pudo eliminar el libro. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleEditBook = useCallback(async (bookId: string, updatedBook: Partial<Book>) => {
    try {
      // Convert camelCase to snake_case for database
      const dbUpdatedBook: Record<string, any> = {};
      
      if ('anioPublicacion' in updatedBook) {
        dbUpdatedBook.anio_publicacion = updatedBook.anioPublicacion;
        delete updatedBook.anioPublicacion;
      }
      
      // Add the rest of the fields
      Object.entries(updatedBook).forEach(([key, value]) => {
        dbUpdatedBook[key] = value;
      });

      const { error } = await supabase
        .from('books')
        .update(dbUpdatedBook)
        .eq('id', bookId);

      if (error) {
        console.error("Error editing book:", error);
        toast({
          title: "Error al editar libro",
          description: "No se pudo editar el libro. Intente nuevamente.",
          variant: "destructive",
        });
        return;
      }

      setLocalBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId ? { ...book, ...updatedBook } : book
        )
      );
      toast({
        title: "Libro editado",
        description: "El libro ha sido editado exitosamente.",
      });
    } catch (error) {
      console.error("Error editing book:", error);
      toast({
        title: "Error al editar libro",
        description: "No se pudo editar el libro. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleAddBook = useCallback(async (newBook: Omit<Book, 'id'>) => {
    try {
      // Convert camelCase to snake_case for database
      const dbNewBook: Record<string, any> = {
        titulo: newBook.titulo,
        autor: newBook.autor,
        isbn: newBook.isbn,
        categoria: newBook.categoria,
        editorial: newBook.editorial,
        anio_publicacion: newBook.anioPublicacion,
        copias: newBook.copias,
        disponibles: newBook.disponibles,
        ubicacion: newBook.ubicacion,
      };
      
      if (newBook.descripcion) {
        dbNewBook.descripcion = newBook.descripcion;
      }
      
      if (newBook.imagen) {
        dbNewBook.imagen = newBook.imagen;
      }

      const { data, error } = await supabase
        .from('books')
        .insert([dbNewBook])
        .select();

      if (error) {
        console.error("Error adding book:", error);
        toast({
          title: "Error al agregar libro",
          description: "No se pudo agregar el libro. Intente nuevamente.",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        // Convert snake_case back to camelCase
        const addedBook: Book = {
          id: data[0].id,
          titulo: data[0].titulo,
          autor: data[0].autor,
          isbn: data[0].isbn,
          categoria: data[0].categoria,
          editorial: data[0].editorial,
          anioPublicacion: data[0].anio_publicacion,
          copias: data[0].copias,
          disponibles: data[0].disponibles,
          ubicacion: data[0].ubicacion,
          descripcion: data[0].descripcion || undefined,
          imagen: data[0].imagen || undefined,
          archivo: data[0].archivo || undefined
        };
        
        setLocalBooks((prevBooks) => [...prevBooks, addedBook]);
        
        toast({
          title: "Libro agregado",
          description: `El libro "${newBook.titulo}" ha sido agregado exitosamente.`,
        });
      }
    } catch (error) {
      console.error("Error adding book:", error);
      toast({
        title: "Error al agregar libro",
        description: "No se pudo agregar el libro. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleAddDigitalBook = useCallback(async (bookId: string, newDigitalBook: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => {
    try {
      // Convert camelCase to snake_case for database
      const dbNewDigitalBook = {
        book_id: bookId,
        formato: newDigitalBook.formato,
        url: newDigitalBook.url,
        tamanio_mb: newDigitalBook.tamanioMb,
        fecha_subida: new Date().toISOString(), // Convert Date to ISO string
        resumen: newDigitalBook.resumen
      };
  
      const { data, error } = await supabase
        .from('digital_books')
        .insert([dbNewDigitalBook])
        .select();
  
      if (error) {
        console.error("Error adding digital book:", error);
        toast({
          title: "Error al agregar libro digital",
          description: "No se pudo agregar el libro digital. Intente nuevamente.",
          variant: "destructive",
        });
        return;
      }
  
      const insertedDigitalBook = data ? data[0] : null;
  
      if (insertedDigitalBook) {
        const newDigitalBookWithId: DigitalBook = {
          id: insertedDigitalBook.id,
          bookId: bookId,
          formato: insertedDigitalBook.formato,
          url: insertedDigitalBook.url,
          tamanioMb: insertedDigitalBook.tamanio_mb,
          fechaSubida: new Date(insertedDigitalBook.fecha_subida),
          resumen: insertedDigitalBook.resumen || undefined
        };
        
        setLocalDigitalBooks(prevDigitalBooks => [...prevDigitalBooks, newDigitalBookWithId]);
  
        toast({
          title: "Libro digital agregado",
          description: `El libro digital para el libro con ID "${bookId}" ha sido agregado exitosamente.`,
        });
      } else {
        toast({
          title: "Error al agregar libro digital",
          description: "No se pudo agregar el libro digital. Intente nuevamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding digital book:", error);
      toast({
        title: "Error al agregar libro digital",
        description: "No se pudo agregar el libro digital. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast]);
  

  const handleDeleteDigitalBook = useCallback(async (digitalBookId: string) => {
    try {
      const { error } = await supabase
        .from('digital_books')
        .delete()
        .eq('id', digitalBookId);

      if (error) {
        console.error("Error deleting digital book:", error);
        toast({
          title: "Error al eliminar libro digital",
          description: "No se pudo eliminar el libro digital. Intente nuevamente.",
          variant: "destructive",
        });
        return;
      }

      setLocalDigitalBooks((prevDigitalBooks) => prevDigitalBooks.filter((digitalBook) => digitalBook.id !== digitalBookId));
      toast({
        title: "Libro digital eliminado",
        description: "El libro digital ha sido eliminado exitosamente.",
      });
    } catch (error) {
      console.error("Error deleting digital book:", error);
      toast({
        title: "Error al eliminar libro digital",
        description: "No se pudo eliminar el libro digital. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleEditDigitalBook = useCallback(async (digitalBookId: string, updatedDigitalBook: Partial<DigitalBook>) => {
    try {
      // Convert camelCase to snake_case for database
      const dbUpdatedDigitalBook: Record<string, any> = {};
      
      if ('tamanioMb' in updatedDigitalBook) {
        dbUpdatedDigitalBook.tamanio_mb = updatedDigitalBook.tamanioMb;
      }
      
      if ('fechaSubida' in updatedDigitalBook && updatedDigitalBook.fechaSubida instanceof Date) {
        dbUpdatedDigitalBook.fecha_subida = updatedDigitalBook.fechaSubida.toISOString();
      }
      
      if ('bookId' in updatedDigitalBook) {
        dbUpdatedDigitalBook.book_id = updatedDigitalBook.bookId;
      }
      
      // Add any remaining fields (formato, url, resumen)
      if ('formato' in updatedDigitalBook) {
        dbUpdatedDigitalBook.formato = updatedDigitalBook.formato;
      }
      
      if ('url' in updatedDigitalBook) {
        dbUpdatedDigitalBook.url = updatedDigitalBook.url;
      }
      
      if ('resumen' in updatedDigitalBook) {
        dbUpdatedDigitalBook.resumen = updatedDigitalBook.resumen;
      }

      const { error } = await supabase
        .from('digital_books')
        .update(dbUpdatedDigitalBook)
        .eq('id', digitalBookId);

      if (error) {
        console.error("Error editing digital book:", error);
        toast({
          title: "Error al editar libro digital",
          description: "No se pudo editar el libro digital. Intente nuevamente.",
          variant: "destructive",
        });
        return;
      }

      setLocalDigitalBooks((prevDigitalBooks) =>
        prevDigitalBooks.map((digitalBook) =>
          digitalBook.id === digitalBookId ? { ...digitalBook, ...updatedDigitalBook } : digitalBook
        )
      );
      toast({
        title: "Libro digital editado",
        description: "El libro digital ha sido editado exitosamente.",
      });
    } catch (error) {
      console.error("Error editing digital book:", error);
      toast({
        title: "Error al editar libro digital",
        description: "No se pudo editar el libro digital. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast]);

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
    handleDeleteDigitalBook,
    handleEditDigitalBook
  };
};
