
import React, { useState, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataExport from '@/components/admin/DataExport';
import DataImport from '@/components/admin/DataImport';
import { NewBookDialog } from '@/components/admin/NewBookDialog';
import { BooksListTab } from '@/components/admin/books/BooksListTab';
import { CategoriesTab } from '@/components/admin/books/CategoriesTab';
import { useBooksManagement } from '@/hooks/use-books-management';
import { useToast } from '@/hooks/use-toast';
import { Suspense } from 'react';

interface GestionLibrosProps {
  defaultTab?: 'libros' | 'categorias' | 'digital';
}

const GestionLibros = ({ defaultTab = 'libros' }: GestionLibrosProps) => {
  const { hasRole } = useAuth();
  const isStaff = hasRole(['administrador', 'bibliotecario']);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  
  const {
    books,
    categories,
    digitalBooks,
    handleAddCategoria,
    handleDeleteCategory,
    handleEditCategory,
    handleDeleteBook,
    handleEditBook,
    handleAddBook,
    handleAddDigitalBook,
    handleDeleteDigitalBook
  } = useBooksManagement();

  const handleImportData = useCallback((data: any[]) => {
    toast({
      title: "Datos importados",
      description: `Se importaron ${data.length} libros correctamente.`
    });
  }, [toast]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto py-6 md:py-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle>Gestión de Libros</CardTitle>
                <CardDescription>
                  Administra el catálogo de libros de la biblioteca
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <DataImport onImport={handleImportData} />
                <DataExport 
                  data={books} 
                  filename="libros-biblioteca" 
                  buttonLabel="Exportar libros"
                />
                <NewBookDialog 
                  categories={categories}
                  onAddBook={handleAddBook}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={defaultTab} value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-4 w-full sm:w-auto flex overflow-x-auto">
                <TabsTrigger value="libros">Libros</TabsTrigger>
                <TabsTrigger value="categorias">Categorías</TabsTrigger>
                <TabsTrigger value="digital">Libros digitales</TabsTrigger>
              </TabsList>
              
              <Suspense fallback={<div className="py-4 text-center">Cargando...</div>}>
                <TabsContent value="libros">
                  <BooksListTab 
                    books={books}
                    categories={categories}
                    digitalBooks={digitalBooks}
                    onDeleteBook={handleDeleteBook}
                    onEditBook={handleEditBook}
                    onDeleteDigitalBook={isStaff ? handleDeleteDigitalBook : undefined}
                    onAddDigitalBook={isStaff ? handleAddDigitalBook : undefined}
                  />
                </TabsContent>
                
                <TabsContent value="categorias">
                  <CategoriesTab 
                    categories={categories}
                    onAddCategoria={handleAddCategoria}
                    onDeleteCategory={handleDeleteCategory}
                    onEditCategory={handleEditCategory}
                  />
                </TabsContent>

                <TabsContent value="digital">
                  <BooksListTab 
                    books={books}
                    categories={categories}
                    digitalBooks={digitalBooks}
                    onDeleteBook={handleDeleteBook}
                    onEditBook={handleEditBook}
                    onDeleteDigitalBook={isStaff ? handleDeleteDigitalBook : undefined}
                    onAddDigitalBook={isStaff ? handleAddDigitalBook : undefined}
                  />
                  <div className="mt-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-medium">Exportar/Importar libros digitales</h3>
                        <p className="text-sm text-muted-foreground">
                          Gestiona tu base de datos de libros digitales
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <DataImport 
                          onImport={(data) => {
                            toast({
                              title: "Libros digitales importados",
                              description: `Se importaron ${data.length} archivos digitales correctamente.`
                            });
                          }} 
                        />
                        <DataExport 
                          data={digitalBooks} 
                          filename="libros-digitales" 
                          buttonLabel="Exportar libros digitales"
                          variant="default"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Suspense>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default GestionLibros;
