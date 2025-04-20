import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Book, mockBooks } from '@/types/book';
import { mockDigitalBooks } from '@/types/digitalBook';
import CatalogPagination from './CatalogPagination';
import { useNavigate } from 'react-router-dom';
import PDFViewer from '@/components/shared/PDFViewer';
import BooksCatalogFilters from './BooksCatalogFilters';
import BookCard from './BookCard';

const ITEMS_PER_PAGE = 9;
const BOOKS_PER_ROW = 3;

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
  setDisponibilidad
}: BooksCatalogProps) {
  const navigate = useNavigate();
  const [libros, setLibros] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const categorias = useMemo(() => {
    return Array.from(new Set(mockBooks.map(libro => libro.categoria)));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    console.log("Filtering books with mockBooks length:", mockBooks.length);
    
    const timeoutId = setTimeout(() => {
      try {
        let filtered = [...mockBooks];
        
        if (searchTerm) {
          const searchTermLower = searchTerm.toLowerCase();
          filtered = filtered.filter(libro => 
            libro.titulo.toLowerCase().includes(searchTermLower) ||
            libro.autor.toLowerCase().includes(searchTermLower) ||
            libro.isbn.includes(searchTerm) ||
            libro.editorial.toLowerCase().includes(searchTermLower)
          );
        }
        
        if (categoria && categoria !== 'all') {
          filtered = filtered.filter(libro => libro.categoria === categoria);
        }
        
        if (disponibilidad === 'disponible') {
          filtered = filtered.filter(libro => libro.disponibles > 0);
        } else if (disponibilidad === 'no-disponible') {
          filtered = filtered.filter(libro => libro.disponibles === 0);
        } else if (disponibilidad === 'digital') {
          const librosConDigital = mockDigitalBooks.map(digital => digital.bookId);
          filtered = filtered.filter(libro => librosConDigital.includes(libro.id));
        }
        
        console.log("Filtered books length:", filtered.length);
        setFilteredBooks(filtered);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error filtering books:", error);
        setFilteredBooks([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, categoria, disponibilidad]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setLibros(filteredBooks.slice(startIndex, endIndex));
  }, [filteredBooks, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  }, [filteredBooks]);

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

      <div className="mb-4">
        <p className="text-gray-600 text-sm sm:text-base">
          {isLoading 
            ? 'Cargando libros...' 
            : `Mostrando ${libros.length} de ${filteredBooks.length} ${filteredBooks.length === 1 ? 'libro' : 'libros'}`
          }
        </p>
      </div>

      {totalPages > 0 && (
        <CatalogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </div>
  );
}
