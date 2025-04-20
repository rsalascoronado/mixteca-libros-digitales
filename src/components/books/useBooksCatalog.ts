
import { useMemo, useState, useEffect } from "react";
import { Book } from "@/types/book";
import { useBooksData } from "./hooks/useBooksData";
import { useBooksRealtime } from "./hooks/useBooksRealtime";

const ITEMS_PER_PAGE = 9;

type UseBooksCatalogProps = {
  searchTerm: string;
  categoria: string;
  disponibilidad: string;
};

/**
 * Combines fetching, realtime sync, and catalog filtering/pagination for books.
 */
export function useBooksCatalog({
  searchTerm,
  categoria,
  disponibilidad,
}: UseBooksCatalogProps) {
  const {
    books,
    setBooks,
    digitalBooks,
    setDigitalBooks,
    isLoading,
    setIsLoading,
  } = useBooksData();

  useBooksRealtime(setBooks, setDigitalBooks);

  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Filtering with debounce effect
  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      try {
        let filtered = [...books];

        if (searchTerm) {
          const searchTermLower = searchTerm.toLowerCase();
          filtered = filtered.filter(
            (libro) =>
              libro.titulo.toLowerCase().includes(searchTermLower) ||
              libro.autor.toLowerCase().includes(searchTermLower) ||
              libro.isbn.includes(searchTerm) ||
              libro.editorial.toLowerCase().includes(searchTermLower)
          );
        }

        if (categoria && categoria !== "all") {
          filtered = filtered.filter((libro) => libro.categoria === categoria);
        }

        if (disponibilidad === "disponible") {
          filtered = filtered.filter((libro) => libro.disponibles > 0);
        } else if (disponibilidad === "no-disponible") {
          filtered = filtered.filter((libro) => libro.disponibles === 0);
        } else if (disponibilidad === "digital") {
          filtered = filtered.filter((libro) => digitalBooks.includes(libro.id));
        }

        setFilteredBooks(filtered);
        setCurrentPage(1);
      } catch (error) {
        setFilteredBooks([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, categoria, disponibilidad, books, digitalBooks, setIsLoading]);

  const totalPages = useMemo(
    () => Math.ceil(filteredBooks.length / ITEMS_PER_PAGE),
    [filteredBooks]
  );

  const libros = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBooks, currentPage]);

  const categorias = useMemo(() => {
    return Array.from(new Set(books.map((libro) => libro.categoria)));
  }, [books]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    libros,
    filteredBooks,
    isLoading,
    categorias,
    totalPages,
    currentPage,
    goToPage,
    setCurrentPage,
  };
}
