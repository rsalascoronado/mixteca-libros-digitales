import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Library } from 'lucide-react';
import ThesisTable from '@/components/thesis/ThesisTable';
import ThesisSearch from '@/components/thesis/ThesisSearch';
import { mockTheses } from '@/types';
import { Thesis } from '@/types';

const ITEMS_PER_PAGE = 9;

const Catalogo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [libros, setLibros] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [thesisSearchTerm, setThesisSearchTerm] = useState('');
  const [thesisTipoFiltro, setThesisTipoFiltro] = useState('');

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationItems = () => {
    const items = [];
    
    const maxPages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
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
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <span className="flex h-9 w-9 items-center justify-center">...</span>
          </PaginationItem>
        );
      }
    }
    
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
    
    if (endPage < totalPages) {
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

  useEffect(() => {
    setTheses(mockTheses);
  }, []);

  const filteredTheses = useMemo(() => {
    return mockTheses.filter(thesis => {
      const matchesSearch = thesisSearchTerm.trim() === '' || 
        thesis.titulo.toLowerCase().includes(thesisSearchTerm.toLowerCase()) ||
        thesis.autor.toLowerCase().includes(thesisSearchTerm.toLowerCase()) ||
        thesis.director.toLowerCase().includes(thesisSearchTerm.toLowerCase());
        
      const matchesTipo = !thesisTipoFiltro || thesisTipoFiltro === 'all' || 
        thesis.tipo === thesisTipoFiltro;
        
      return matchesSearch && matchesTipo;
    });
  }, [thesisSearchTerm, thesisTipoFiltro]);

  return (
    <MainLayout>
      <div className="container mx-auto py-4 sm:py-8 px-4">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">Catálogo</h1>
          
          <Tabs defaultValue="books" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="books" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                Libros
              </TabsTrigger>
              <TabsTrigger value="theses" className="flex items-center gap-2">
                <Library className="h-4 w-4" />
                Tesis
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="books" className="mt-0">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4">
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
            </TabsContent>
            
            <TabsContent value="theses" className="mt-0">
              <ThesisSearch
                busqueda={thesisSearchTerm}
                tipoFiltro={thesisTipoFiltro}
                onBusquedaChange={setThesisSearchTerm}
                onTipoFiltroChange={setThesisTipoFiltro}
                onLimpiarFiltros={() => {
                  setThesisSearchTerm('');
                  setThesisTipoFiltro('');
                }}
              />
              
              <div className="mb-4">
                <p className="text-gray-600 text-sm sm:text-base">
                  Mostrando {filteredTheses.length} {filteredTheses.length === 1 ? 'tesis' : 'tesis'}
                </p>
              </div>
              
              <ThesisTable 
                theses={filteredTheses} 
                onEdit={() => {}} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Catalogo;
