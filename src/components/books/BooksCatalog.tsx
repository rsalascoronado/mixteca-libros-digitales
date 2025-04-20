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

  const handleVerDetalles = (libroId: string) => {
    navigate(`/libro/${libroId}`);
  };

  const hasDigitalVersion = (bookId: string) => {
    return mockDigitalBooks.some(digital => digital.bookId === bookId);
  };

  const getDigitalBookUrl = (bookId: string) => {
    const digitalBook = mockDigitalBooks.find(digital => digital.bookId === bookId);
    return digitalBook?.url || '';
  };

  return (
    <div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <Label htmlFor="search">Buscar por título, autor o ISBN</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                id="search"
                type="text"
                placeholder="Buscar..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="categoria">Categoría</Label>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger id="categoria">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="disponibilidad">Disponibilidad</Label>
            <Select value={disponibilidad} onValueChange={setDisponibilidad}>
              <SelectTrigger id="disponibilidad">
                <SelectValue placeholder="Cualquier disponibilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cualquier disponibilidad</SelectItem>
                <SelectItem value="disponible">Disponible físicamente</SelectItem>
                <SelectItem value="no-disponible">No disponible</SelectItem>
                <SelectItem value="digital">Disponible en digital</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto">
            Limpiar filtros
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {libros.map((libro) => (
          <div key={libro.id} className="border rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">{libro.titulo}</h3>
            <p className="text-gray-600 mb-2">Autor: {libro.autor}</p>
            <p className="text-sm text-gray-500">Categoría: {libro.categoria}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-700">Disponibles: {libro.disponibles}</span>
              <div className="flex gap-2">
                {hasDigitalVersion(libro.id) && (
                  <PDFViewer
                    url={getDigitalBookUrl(libro.id)}
                    fileName={`${libro.titulo}.pdf`}
                  />
                )}
                <Button 
                  size="sm" 
                  onClick={() => handleVerDetalles(libro.id)}
                >
                  Ver Detalles
                </Button>
              </div>
            </div>
          </div>
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
