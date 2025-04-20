
import { useState, useEffect, useMemo } from "react";
import { Book, mockBooks } from "@/types/book";
import { mockDigitalBooks } from "@/types/digitalBook";

const ITEMS_PER_PAGE = 9;

type UseBooksCatalogProps = {
  searchTerm: string;
  categoria: string;
  disponibilidad: string;
};

export function useBooksCatalog({
  searchTerm,
  categoria,
  disponibilidad,
}: UseBooksCatalogProps) {
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);

    const timeoutId = setTimeout(() => {
      try {
        let filtered = [...mockBooks];

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
          const librosConDigital = mockDigitalBooks.map((digital) => digital.bookId);
          filtered = filtered.filter((libro) => librosConDigital.includes(libro.id));
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
  }, [searchTerm, categoria, disponibilidad]);

  const totalPages = useMemo(
    () => Math.ceil(filteredBooks.length / ITEMS_PER_PAGE),
    [filteredBooks]
  );

  const libros = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBooks, currentPage]);

  const categorias = useMemo(() => {
    return Array.from(new Set(mockBooks.map((libro) => libro.categoria)));
  }, []);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilters = () => {
    // El hook no implementa esto, pero puede exponerse si fuera necesario.
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
