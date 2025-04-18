import React, { useState, useEffect } from 'react';
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

const Catalogo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [libros, setLibros] = useState<Book[]>([]);
  
  // Obtener categorías únicas de los libros
  const categorias = Array.from(new Set(mockBooks.map(libro => libro.categoria)));

  // Filtrar libros
  useEffect(() => {
    let filteredBooks = [...mockBooks];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filteredBooks = filteredBooks.filter(libro => 
        libro.titulo.toLowerCase().includes(searchTermLower) ||
        libro.autor.toLowerCase().includes(searchTermLower) ||
        libro.isbn.includes(searchTerm) ||
        libro.editorial.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Filtrar por categoría
    if (categoria) {
      filteredBooks = filteredBooks.filter(libro => libro.categoria === categoria);
    }
    
    // Filtrar por disponibilidad
    if (disponibilidad === 'disponible') {
      filteredBooks = filteredBooks.filter(libro => libro.disponibles > 0);
    } else if (disponibilidad === 'no-disponible') {
      filteredBooks = filteredBooks.filter(libro => libro.disponibles === 0);
    } else if (disponibilidad === 'digital') {
      const librosConDigital = mockDigitalBooks.map(digital => digital.bookId);
      filteredBooks = filteredBooks.filter(libro => librosConDigital.includes(libro.id));
    }
    
    setLibros(filteredBooks);
  }, [searchTerm, categoria, disponibilidad]);

  const resetFilters = () => {
    setSearchTerm('');
    setCategoria('');
    setDisponibilidad('');
  };

  // Función para obtener las versiones digitales de un libro
  const getDigitalVersions = (bookId: string) => {
    return mockDigitalBooks.filter(digital => digital.bookId === bookId);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Catálogo de Libros</h1>
          
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
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
                  <SelectTrigger>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Cualquier disponibilidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Cualquier disponibilidad</SelectItem>
                    <SelectItem value="disponible">Disponible físicamente</SelectItem>
                    <SelectItem value="no-disponible">No disponible</SelectItem>
                    <SelectItem value="digital">Disponible en digital</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={resetFilters} className="mr-2">
                Limpiar filtros
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-gray-600">
              Mostrando {libros.length} {libros.length === 1 ? 'libro' : 'libros'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libros.map((libro) => {
            const versionesDigitales = getDigitalVersions(libro.id);
            return (
              <Card key={libro.id} className="overflow-hidden">
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  {libro.imagen ? (
                    <img 
                      src={libro.imagen} 
                      alt={libro.titulo} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BookPlus className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-2">{libro.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-gray-600 mb-2">{libro.autor}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm bg-accent/80 px-2 py-1 rounded">
                      {libro.categoria}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${libro.disponibles > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {libro.disponibles > 0 
                          ? `${libro.disponibles} disponibles` 
                          : 'No disponible'
                        }
                      </span>
                      {versionesDigitales.length > 0 && (
                        <span className="text-sm text-blue-600 flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          Digital
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Editorial: {libro.editorial}, {libro.anioPublicacion}
                  </p>
                  <p className="text-sm text-gray-500">
                    ISBN: {libro.isbn}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Link to={`/libro/${libro.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
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
          })}
        </div>
        
        {libros.length === 0 && (
          <div className="text-center py-10">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">No se encontraron libros</h3>
            <p className="text-gray-500 mt-2 mb-6">Intenta con otros términos de búsqueda o elimina los filtros</p>
            <Button onClick={resetFilters}>Mostrar todos los libros</Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Catalogo;
