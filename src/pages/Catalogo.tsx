
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Book, mockBooks } from '@/types';
import { Search, BookOpen, BookPlus, FileText } from 'lucide-react';
import { mockDigitalBooks } from '@/types/digitalBook';
import PDFViewer from '@/components/shared/PDFViewer';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const ITEMS_PER_PAGE = 9;

const Catalogo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [libros, setLibros] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  
  const categorias = useMemo(() => {
    return Array.from(new Set(mockBooks.map(libro => libro.categoria)));
  }, []);

  // Filter books based on search term and filters
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
        setCurrentPage(1); // Reset to first page when filters change
      } catch (error) {
        console.error("Error filtering books:", error);
        setFilteredBooks([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, categoria, disponibilidad]);

  // Paginate the results
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

  const digitalVersionsMap = useMemo(() => {
    const map = new Map();
    mockDigitalBooks.forEach(digital => {
      if (!map.has(digital.bookId)) {
        map.set(digital.bookId, []);
      }
      map.get(digital.bookId).push(digital);
    });
    return map;
  }, []);

  const getDigitalVersions = (bookId: string) => {
    return digitalVersionsMap.get(bookId) || [];
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    // Maximum number of page links to show
    const maxPages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    // Add first page if not included
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink 
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Add ellipsis if there's a gap
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
    }
    
    // Add page links
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Add last page if not included
    if (endPage < totalPages) {
      // Add ellipsis if there's a gap
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-4 sm:py-8 px-4">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Catálogo de Libros</h1>
          
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <Label htmlFor="search" className="mb-2 block">Buscar por título, autor o ISBN</Label>
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
                <Label htmlFor="categoria" className="mb-2 block">Categoría</Label>
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
                <Label htmlFor="disponibilidad" className="mb-2 block">Disponibilidad</Label>
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
          
          <div className="mb-4">
            <p className="text-gray-600 text-sm sm:text-base">
              {isLoading 
                ? 'Cargando libros...' 
                : `Mostrando ${libros.length} de ${filteredBooks.length} ${filteredBooks.length === 1 ? 'libro' : 'libros'}`
              }
            </p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-32 sm:h-40 w-full" />
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="pb-4">
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {libros.length > 0 ? libros.map((libro) => {
                const versionesDigitales = getDigitalVersions(libro.id);
                return (
                  <Card key={libro.id} className="overflow-hidden">
                    <div className="h-32 sm:h-40 bg-gray-200 flex items-center justify-center">
                      {libro.imagen ? (
                        <img 
                          src={libro.imagen} 
                          alt={libro.titulo} 
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <BookPlus className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400" />
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base sm:text-lg line-clamp-2">{libro.titulo}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-sm sm:text-base text-gray-600 mb-2">{libro.autor}</p>
                      <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                        <span className="text-xs sm:text-sm bg-accent/80 px-2 py-1 rounded">
                          {libro.categoria}
                        </span>
                        <div className="flex items-center gap-2 text-xs sm:text-sm">
                          <span className={`${libro.disponibles > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {libro.disponibles > 0 
                              ? `${libro.disponibles} disponibles` 
                              : 'No disponible'
                            }
                          </span>
                          {versionesDigitales.length > 0 && (
                            <span className="text-blue-600 flex items-center gap-1">
                              <FileText className="h-3 sm:h-4 w-3 sm:w-4" />
                              Digital
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Editorial: {libro.editorial}, {libro.anioPublicacion}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        ISBN: {libro.isbn}
                      </p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <Link to={`/libro/${libro.id}`} className="w-full">
                        <Button variant="outline" className="w-full text-sm sm:text-base">
                          <BookOpen className="mr-2 h-3 sm:h-4 w-3 sm:w-4" />
                          Ver detalles
                        </Button>
                      </Link>
                      {versionesDigitales.length > 0 && (
                        <div className="w-full flex flex-wrap gap-2">
                          {versionesDigitales.map((version) => (
                            <PDFViewer
                              key={version.id}
                              url={version.url}
                              fileName={`${libro.titulo} - ${version.formato}`}
                            />
                          ))}
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                );
              }) : (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-8 sm:py-10">
                  <BookOpen className="h-12 sm:h-16 w-12 sm:w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-gray-600">No se encontraron libros</h3>
                  <p className="text-sm sm:text-base text-gray-500 mt-2 mb-6">Intenta con otros términos de búsqueda o elimina los filtros</p>
                  <Button onClick={resetFilters}>Mostrar todos los libros</Button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredBooks.length > ITEMS_PER_PAGE && (
              <Pagination className="mt-8">
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                    </PaginationItem>
                  )}
                  
                  {renderPaginationItems()}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Catalogo;
