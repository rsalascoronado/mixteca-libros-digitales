
import React from 'react';
import { BooksCatalogFilters } from './BooksCatalogFilters';
import BookCard from './BookCard';
import CatalogPagination from './CatalogPagination';
import BooksCatalogSummary from './BooksCatalogSummary';
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {libros.map((libro) => (
          <BookCard key={libro.id} libro={libro} />
        ))}
      </div>

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
