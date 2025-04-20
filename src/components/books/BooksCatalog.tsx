import React, { useState } from 'react';
import BooksCatalogFilters from './BooksCatalogFilters';
import BookList from './BooksCatalogBookList';
import BooksCatalogSummary from './BooksCatalogSummary';
import CatalogPagination from './CatalogPagination';
import { useBooksCatalog } from './useBooksCatalog';
import { Book } from '@/types/book';

interface BooksCatalogProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoria: string;
  setCategoria: (category: string) => void;
  disponibilidad: string;
  setDisponibilidad: (availability: string) => void;
  booksProp?: Book[]; // Nuevo parámetro opcional para datos externos (reales)
}

export function BooksCatalog({
  searchTerm,
  setSearchTerm,
  categoria,
  setCategoria,
  disponibilidad,
  setDisponibilidad,
  booksProp,
}: BooksCatalogProps) {
  // Si llegan datos reales, usarlos, si no, fallback al hook original
  const [pendingSearchTerm, setPendingSearchTerm] = useState(searchTerm);

  let libros = booksProp ?? [];
  let isLoading = false;
  let categorias: string[] = [];
  if (booksProp) {
    // obtener categorías a partir de los datos recibidos
    categorias = Array.from(new Set(booksProp.map(b => b.categoria)));
  } else {
    const c = useBooksCatalog({ searchTerm, categoria, disponibilidad });
    libros = c.libros;
    isLoading = c.isLoading;
    categorias = c.categorias;
  }

  const handleBuscar = () => {
    setSearchTerm(pendingSearchTerm);
    console.log(`Búsqueda ejecutada con término: "${pendingSearchTerm}"`);
  };

  const resetFilters = () => {
    setPendingSearchTerm('');
    setSearchTerm('');
    setCategoria('');
    setDisponibilidad('');
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
          filteredLength={libros.length}
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
    </div>
  );
}
