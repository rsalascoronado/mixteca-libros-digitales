
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockBooks, mockCategories } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DataExport from '@/components/admin/DataExport';
import DataImport from '@/components/admin/DataImport';
import { CategoriaDialog } from '@/components/admin/CategoriaDialog';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GestionLibros = () => {
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast();
  const [categories, setCategories] = React.useState(mockCategories);
  
  const filteredBooks = React.useMemo(() => {
    return mockBooks.filter(book => 
      book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
    );
  }, [searchTerm]);

  const handleImportData = (data: any[]) => {
    toast({
      title: "Datos importados",
      description: `Se importaron ${data.length} libros correctamente.`
    });
  };

  const handleAddCategoria = (categoria: { nombre: string; descripcion?: string }) => {
    const newCategoria = {
      id: Math.random().toString(36).substr(2, 9),
      ...categoria
    };
    setCategories([...categories, newCategoria]);
    toast({
      title: "Categoría agregada",
      description: `La categoría "${categoria.nombre}" ha sido agregada exitosamente.`
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gestión de Libros</CardTitle>
                <CardDescription>
                  Administra el catálogo de libros de la biblioteca
                </CardDescription>
              </div>
              <div className="flex gap-2 items-center">
                <DataImport onImport={handleImportData} />
                <DataExport 
                  data={mockBooks} 
                  filename="libros-biblioteca" 
                  buttonLabel="Exportar libros"
                />
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuevo libro
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="libros">
              <TabsList className="mb-4">
                <TabsTrigger value="libros">Libros</TabsTrigger>
                <TabsTrigger value="categorias">Categorías</TabsTrigger>
              </TabsList>
              
              <TabsContent value="libros">
                <div className="flex items-center mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Buscar por título, autor o ISBN..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Autor</TableHead>
                        <TableHead>ISBN</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Disponibles</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBooks.map((book) => (
                        <TableRow key={book.id}>
                          <TableCell className="font-medium">{book.titulo}</TableCell>
                          <TableCell>{book.autor}</TableCell>
                          <TableCell>{book.isbn}</TableCell>
                          <TableCell>{book.categoria}</TableCell>
                          <TableCell>{book.disponibles} / {book.copias}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                                Eliminar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="categorias">
                <div className="flex justify-end mb-4">
                  <CategoriaDialog onAddCategoria={handleAddCategoria} />
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.nombre}</TableCell>
                          <TableCell>{category.descripcion}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                                Eliminar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default GestionLibros;
