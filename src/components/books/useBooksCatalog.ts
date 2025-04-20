
import { useState, useEffect, useMemo } from "react";
import { Book, mockBooks } from "@/types/book";
import { mockDigitalBooks } from "@/types/digitalBook";
import { supabase } from "@/integrations/supabase/client";

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
  const [books, setBooks] = useState<Book[]>([]);
  const [digitalBooks, setDigitalBooks] = useState<string[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch initial data from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data: booksData, error: booksError } = await supabase
          .from("books")
          .select("*");
        if (booksError) throw booksError;
        if (isMounted) {
          setBooks(booksData ?? []);
        }

        const { data: digitalBooksData, error: digitalError } = await supabase
          .from("digital_books")
          .select("book_id");
        if (digitalError) throw digitalError;
        if (isMounted) {
          setDigitalBooks(
            (digitalBooksData ?? []).map((item) => item.book_id)
          );
        }
      } catch (error) {
        setBooks([...mockBooks]);
        setDigitalBooks(mockDigitalBooks.map((db) => db.bookId));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Real-time subscription to books table changes
  useEffect(() => {
    const booksChannel = supabase
      .channel("public:books")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "books" },
        (payload) => {
          setBooks((currentBooks) => {
            switch (payload.eventType) {
              case "INSERT":
                return [...currentBooks, payload.new as Book];
              case "UPDATE":
                return currentBooks.map((book) =>
                  book.id === payload.new.id ? (payload.new as Book) : book
                );
              case "DELETE":
                return currentBooks.filter(
                  (book) => book.id !== payload.old.id
                );
              default:
                return currentBooks;
            }
          });
        }
      )
      .subscribe();

    const digitalBooksChannel = supabase
      .channel("public:digital_books")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "digital_books" },
        (payload) => {
          setDigitalBooks((currentDigitalBooks) => {
            switch (payload.eventType) {
              case "INSERT":
                return [...currentDigitalBooks, (payload.new as any).book_id];
              case "UPDATE":
                // Usually book_id won't change, but if it does:
                return currentDigitalBooks.map((id) =>
                  id === (payload.old as any).book_id
                    ? (payload.new as any).book_id
                    : id
                );
              case "DELETE":
                return currentDigitalBooks.filter(
                  (id) => id !== (payload.old as any).book_id
                );
              default:
                return currentDigitalBooks;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(booksChannel);
      supabase.removeChannel(digitalBooksChannel);
    };
  }, []);

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
  }, [searchTerm, categoria, disponibilidad, books, digitalBooks]);

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
