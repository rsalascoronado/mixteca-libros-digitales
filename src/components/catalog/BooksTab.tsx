
import React, { useState, useMemo } from "react";
import { BooksCatalog } from "@/components/books/BooksCatalog";
import { IBook } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fetchBooks = async () => {
  try {
    const { data, error } = await supabase.from("books").select("*");

    if (error) throw error;

    return (data || []).map((book: any) => ({
      id: book.id,
      titulo: book.titulo,
      autor: book.autor,
      isbn: book.isbn,
      categoria: book.categoria,
      editorial: book.editorial,
      anioPublicacion: book.anio_publicacion,
      copias: book.copias,
      disponibles: book.disponibles,
      imagen: book.imagen || undefined,
      ubicacion: book.ubicacion,
      descripcion: book.descripcion || undefined,
    })) as IBook[];
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

interface BooksTabProps {
  // No props required, tab handles its own state.
}

const BooksTab: React.FC<BooksTabProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoria, setCategoria] = useState("");
  const [disponibilidad, setDisponibilidad] = useState("");

  const {
    data: books = [],
    isLoading: booksLoading,
    error: booksError,
  } = useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchSearch =
        !searchTerm ||
        book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.isbn.includes(searchTerm) ||
        book.editorial.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = !categoria || book.categoria === categoria;
      return matchSearch && matchCategory;
    });
  }, [books, searchTerm, categoria]);

  if (booksLoading)
    return (
      <div className="p-4 text-center text-muted-foreground">
        Cargando libros...
      </div>
    );
  if (booksError)
    return (
      <div className="p-4 text-red-500 text-sm">
        Error obteniendo libros: {(booksError as Error).message}
      </div>
    );

  return (
    <BooksCatalog
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      categoria={categoria}
      setCategoria={setCategoria}
      disponibilidad={disponibilidad}
      setDisponibilidad={setDisponibilidad}
      booksProp={filteredBooks}
    />
  );
};

export default BooksTab;
