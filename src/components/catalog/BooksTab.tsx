
import React, { useState } from "react";
import { BooksCatalog } from "@/components/books/BooksCatalog";
import { useBooksData } from "@/components/books/hooks/useBooksData"; // Hook de prueba integrado

/**
 * Modo PRUEBA: Buscamos y filtramos los libros localmente.
 * Se usa el hook useBooksData que trae los libros (de supabase o mocks), y la lógica de paginación/filtro está en BooksCatalog.
 * No hay fetching react-query en este archivo.
 */
const BooksTab: React.FC = () => {
  const { books, digitalBooks } = useBooksData();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoria, setCategoria] = useState("");
  const [disponibilidad, setDisponibilidad] = useState("");

  return (
    <BooksCatalog
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      categoria={categoria}
      setCategoria={setCategoria}
      disponibilidad={disponibilidad}
      setDisponibilidad={setDisponibilidad}
      booksProp={books} // Entregamos los libros para filtrar localmente
    />
  );
};

export default BooksTab;
