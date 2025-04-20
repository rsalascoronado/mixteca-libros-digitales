
import React from 'react';
import BooksCatalogFilters from './BooksCatalogFilters';
import BookList from './BooksCatalogBookList';
import BooksCatalogSummary from './BooksCatalogSummary';
import CatalogPagination from './CatalogPagination';
import { useBooksCatalog } from './useBooksCatalog';

interface BooksCatalogProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoria: string;
  setCategoria: (category: string) => void;
  disponibilidad: string;
  setDisponibilidad: (availability: string) => void;
}

export function BooksCatalog({
  searchTerm,
  setSearchTerm,
  categoria,
  setCategoria,
  disponibilidad,
  setDisponibilidad,
}: BooksCatalogProps) {
  const {
    libros,
    filteredBooks,
    isLoading,
    categorias,
    totalPages,
    currentPage,
    goToPage,
    setCurrentPage,
  } = useBooksCatalog({ searchTerm, categoria, disponibilidad });

  const resetFilters = () => {
    setSearchTerm('');
    setCategoria('');
    setDisponibilidad('');
    setCurrentPage(1);
  };

  return (
    <div>
      <BooksCatalogFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoria={categoria}
        setCategoria={setCategoria}
        categorias={categorias}
        disponibilidad={disponibilidad}
        setDisponibilidad={setDisponibilidad}
        resetFilters={resetFilters}
      />

      <BookList libros={libros} />

      <BooksCatalogSummary
        isLoading={isLoading}
        librosLength={libros.length}
        filteredLength={filteredBooks.length}
      />

      {totalPages > 0 && (
        <CatalogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </div>
  );
}
