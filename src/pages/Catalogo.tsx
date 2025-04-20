
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Library, Microscope } from 'lucide-react';
import ThesisTable from '@/components/thesis/ThesisTable';
import ThesisSearch from '@/components/thesis/ThesisSearch';
import { mockTheses } from '@/types';
import { BooksCatalog } from '@/components/books/BooksCatalog';
import BookSearchResultTest from '@/components/books/BookSearchResultTest';

const Catalogo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoria, setCategoria] = useState('');
  const [disponibilidad, setDisponibilidad] = useState('');
  const [thesisSearchTerm, setThesisSearchTerm] = useState('');
  const [thesisTipoFiltro, setThesisTipoFiltro] = useState('');
  const [showTestMode, setShowTestMode] = useState(false);
  
  const filteredTheses = React.useMemo(() => {
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Catálogo</h1>
            <button 
              onClick={() => setShowTestMode(!showTestMode)}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              {showTestMode ? "Modo Normal" : "Modo Prueba"}
            </button>
          </div>
          
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
              {showTestMode && (
                <TabsTrigger value="test" className="flex items-center gap-2">
                  <Microscope className="h-4 w-4" />
                  Prueba
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="books" className="mt-0">
              {showTestMode ? (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                  <p className="text-sm text-yellow-800">
                    Mostrando la versión normal del catálogo de libros. 
                    Esta es la implementación actual del buscador.
                  </p>
                </div>
              ) : null}
              
              <BooksCatalog
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categoria={categoria}
                setCategoria={setCategoria}
                disponibilidad={disponibilidad}
                setDisponibilidad={setDisponibilidad}
              />
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
            
            {showTestMode && (
              <TabsContent value="test" className="mt-0">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md mb-4">
                  <p className="text-sm text-yellow-800">
                    Modo de prueba: Este componente es solo para probar visualmente que la búsqueda de libros 
                    funcione correctamente. Puedes buscar por título, autor, ISBN o editorial.
                  </p>
                </div>
                <BookSearchResultTest />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Catalogo;
