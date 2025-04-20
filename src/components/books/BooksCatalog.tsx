
import React, { useState } from 'react';
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
  const [pendingSearchTerm, setPendingSearchTerm] = useState(searchTerm);

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

  const handleBuscar = () => {
    setSearchTerm(pendingSearchTerm);
    setCurrentPage(1);
    console.log(`Búsqueda ejecutada con término: "${pendingSearchTerm}"`);
  };

  const resetFilters = () => {
    setPendingSearchTerm('');
    setSearchTerm('');
    setCategoria('');
    setDisponibilidad('');
    setCurrentPage(1);
    console.log('Filtros de búsqueda reiniciados');
  };

  return (
    <div className="space-y-4">
      <BooksCatalogFilters
        searchTerm={pendingSearchTerm}
        setSearchTerm={setPendingSearchTerm}
        categoria={categoria}
        setCategoria={setCategoria}
        categorias={categorias}
        disponibilidad={disponibilidad}
        setDisponibilidad={setDisponibilidad}
        resetFilters={resetFilters}
        onBuscar={handleBuscar}
        isUserLoggedIn={true}
      />

      {/* Título de resultados de búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
        <h3 className="text-lg font-semibold">Resultados de búsqueda</h3>
        <BooksCatalogSummary
          isLoading={isLoading}
          librosLength={libros.length}
          filteredLength={filteredBooks.length}
        />
      </div>

      {/* Listado de resultados */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Cargando resultados...</div>
        ) : libros.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No se encontraron libros que coincidan con los criterios de búsqueda
          </div>
        ) : (
          <BookList libros={libros} searchTerm={searchTerm} />
        )}
      </div>

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
