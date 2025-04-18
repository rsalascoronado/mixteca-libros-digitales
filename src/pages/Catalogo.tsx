
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
import { Search, BookOpen, BookPlus } from 'lucide-react';

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
    }
    
    setLibros(filteredBooks);
  }, [searchTerm, categoria, disponibilidad]);

  const resetFilters = () => {
    setSearchTerm('');
    setCategoria('');
    setDisponibilidad('');
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
                    <SelectItem value="">Todas las categorías</SelectItem>
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
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="no-disponible">No disponible</SelectItem>
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
          {libros.map((libro) => (
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
                  <span className={`text-sm ${libro.disponibles > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {libro.disponibles > 0 
                      ? `${libro.disponibles} disponibles` 
                      : 'No disponible'
                    }
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Editorial: {libro.editorial}, {libro.anioPublicacion}
                </p>
                <p className="text-sm text-gray-500">
                  ISBN: {libro.isbn}
                </p>
              </CardContent>
              <CardFooter>
                <Link to={`/libro/${libro.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Ver detalles
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
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
