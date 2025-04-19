import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockBooks, mockCategories, BookCategory, Book } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Edit, Trash, MoreHorizontal, Database, Upload, BookPlus } from 'lucide-react';
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
import { EditCategoriaDialog } from '@/components/admin/EditCategoriaDialog';
import { EditBookDialog } from '@/components/admin/EditBookDialog';
import { DigitalBooksDialog } from '@/components/admin/digital-books/DigitalBooksDialog';
import { UploadDigitalBookDialog } from '@/components/admin/digital-books/UploadDigitalBookDialog';
import { mockDigitalBooks, DigitalBook } from '@/types/digitalBook';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NewDigitalBookDialog } from '@/components/admin/NewDigitalBookDialog';
import { NewBookDialog } from '@/components/admin/NewBookDialog';

interface GestionLibrosProps {
  defaultTab?: 'libros' | 'categorias' | 'digital';
}

const GestionLibros = ({ defaultTab = 'libros' }: GestionLibrosProps) => {
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast();
  const [categories, setCategories] = React.useState(mockCategories);
  const [books, setBooks] = React.useState(mockBooks);
  const [digitalBooks, setDigitalBooks] = React.useState(mockDigitalBooks);
  
  const filteredBooks = React.useMemo(() => {
    return books.filter(book => 
      book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
    );
  }, [books, searchTerm]);

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

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada exitosamente."
    });
  };

  const handleEditCategory = (id: string, categoria: Omit<BookCategory, 'id'>) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, ...categoria } : cat
    ));
    toast({
      title: "Categoría actualizada",
      description: `La categoría "${categoria.nombre}" ha sido actualizada exitosamente.`
    });
  };

  const handleDeleteBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id));
    toast({
      title: "Libro eliminado",
      description: "El libro ha sido eliminado exitosamente."
    });
  };

  const handleEditBook = (id: string, bookData: Partial<Book>) => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, ...bookData } : book
    ));
    toast({
      title: "Libro actualizado",
      description: "Los cambios han sido guardados exitosamente."
    });
  };

  const handleAddDigitalBook = (bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => {
    const newDigitalBook: DigitalBook = {
      id: Math.random().toString(36).substr(2, 9),
      bookId,
      fechaSubida: new Date(),
      ...data
    };
    setDigitalBooks([...digitalBooks, newDigitalBook]);
    toast({
      title: "Archivo digital agregado",
      description: `Se ha agregado una versión ${data.formato} al libro correctamente.`
    });
  };

  const handleAddBook = (book: Book) => {
    setBooks([...books, book]);
    toast({
      title: "Libro agregado",
      description: "El libro ha sido agregado exitosamente."
    });
  };

  const handleDeleteDigitalBook = (id: string) => {
    setDigitalBooks(digitalBooks.filter(db => db.id !== id));
    toast({
      title: "Archivo digital eliminado",
      description: "El archivo digital ha sido eliminado exitosamente."
    });
  };

  const handleAddBookDigital = (book: Book) => {
    setBooks([...books, book]);
    toast({
      title: "Libro digital agregado",
      description: "Se ha agregado un nuevo libro digital al catálogo."
    });
  };

  const isStaff = hasRole(['administrador', 'bibliotecario']);

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
            <Tabs defaultValue={defaultTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="libros">Libros</TabsTrigger>
                <TabsTrigger value="categorias">Categorías</TabsTrigger>
                <TabsTrigger value="digital">Libros digitales</TabsTrigger>
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Acciones</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <EditBookDialog
                                    book={book}
                                    categories={categories}
                                    onEditBook={handleEditBook}
                                  />
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <DigitalBooksDialog 
                                    book={book} 
                                    digitalBooks={digitalBooks}
                                  />
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteBook(book.id)}
                                  className="text-red-500 focus:text-red-500"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
                              <EditCategoriaDialog 
                                categoria={category}
                                onEditCategoria={handleEditCategory}
                              />
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteCategory(category.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
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

              <TabsContent value="digital">
                <div className="flex justify-end mb-4">
                  {isStaff && (
                    <NewDigitalBookDialog 
                      categories={categories}
                      onAddBook={handleAddBookDigital}
                    />
                  )}
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Autor</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Versiones digitales</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {books.map((book) => {
                        const bookDigitalVersions = digitalBooks.filter(db => db.bookId === book.id);
                        return (
                          <TableRow key={book.id}>
                            <TableCell className="font-medium">{book.titulo}</TableCell>
                            <TableCell>{book.autor}</TableCell>
                            <TableCell>{book.categoria}</TableCell>
                            <TableCell>{bookDigitalVersions.length}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <DigitalBooksDialog 
                                  book={book} 
                                  digitalBooks={digitalBooks}
                                  onDeleteDigitalBook={isStaff ? handleDeleteDigitalBook : undefined}
                                />
                                {isStaff && (
                                  <UploadDigitalBookDialog 
                                    book={book} 
                                    onAddDigitalBook={handleAddDigitalBook}
                                  />
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between">
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
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default GestionLibros;
