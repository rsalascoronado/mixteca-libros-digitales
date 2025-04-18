
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BookPlus, 
  Search, 
  Pencil, 
  Trash,
  Plus,
  FilterX,
  BookOpen,
  AlertTriangle,
  Check,
  X
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Book, mockBooks } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const GestionLibros = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [libros, setLibros] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');

  // Estado para el formulario de nuevo libro
  const [nuevoLibro, setNuevoLibro] = useState<Partial<Book>>({
    titulo: '',
    autor: '',
    isbn: '',
    categoria: '',
    editorial: '',
    anioPublicacion: new Date().getFullYear(),
    copias: 1,
    disponibles: 1,
    ubicacion: '',
    descripcion: ''
  });

  // Estado para el libro a editar
  const [libroEditando, setLibroEditando] = useState<Book | null>(null);

  // Estado para la acción de eliminar
  const [libroAEliminar, setLibroAEliminar] = useState<string | null>(null);

  useEffect(() => {
    // Verificar permisos
    if (!hasRole(['bibliotecario', 'administrador'])) {
      navigate('/');
      return;
    }

    // Cargar libros
    setLoading(true);
    setTimeout(() => {
      setLibros([...mockBooks]);
      setLoading(false);
    }, 500);
  }, [hasRole, navigate]);

  // Obtener categorías únicas de los libros
  const categorias = Array.from(new Set(mockBooks.map(libro => libro.categoria)));

  // Filtrar libros
  const librosFiltrados = libros.filter(libro => {
    let cumpleBusqueda = true;
    let cumpleCategoria = true;
    
    // Filtro por búsqueda
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      cumpleBusqueda = 
        libro.titulo.toLowerCase().includes(busquedaLower) ||
        libro.autor.toLowerCase().includes(busquedaLower) ||
        libro.isbn.includes(busqueda) ||
        libro.editorial.toLowerCase().includes(busquedaLower);
    }
    
    // Filtro por categoría
    if (categoria) {
      cumpleCategoria = libro.categoria === categoria;
    }
    
    return cumpleBusqueda && cumpleCategoria;
  });

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoria('');
  };

  // Manejar cambios en el formulario de nuevo libro
  const handleNuevoLibroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoLibro(prev => ({
      ...prev,
      [name]: name === 'anioPublicacion' || name === 'copias' || name === 'disponibles' 
        ? parseInt(value, 10) 
        : value
    }));
  };

  // Agregar nuevo libro
  const handleAgregarLibro = () => {
    // Validar datos mínimos
    if (!nuevoLibro.titulo || !nuevoLibro.autor || !nuevoLibro.isbn || !nuevoLibro.categoria) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    // Crear nuevo libro
    const newId = (Math.max(...libros.map(l => parseInt(l.id, 10))) + 1).toString();
    const nuevoLibroCompleto: Book = {
      id: newId,
      titulo: nuevoLibro.titulo,
      autor: nuevoLibro.autor,
      isbn: nuevoLibro.isbn,
      categoria: nuevoLibro.categoria,
      editorial: nuevoLibro.editorial || 'Sin editorial',
      anioPublicacion: nuevoLibro.anioPublicacion || new Date().getFullYear(),
      copias: nuevoLibro.copias || 1,
      disponibles: nuevoLibro.disponibles || 1,
      ubicacion: nuevoLibro.ubicacion || 'Sin ubicación',
      descripcion: nuevoLibro.descripcion,
    };

    // Agregar a la lista
    setLibros(prev => [...prev, nuevoLibroCompleto]);

    // Limpiar formulario
    setNuevoLibro({
      titulo: '',
      autor: '',
      isbn: '',
      categoria: '',
      editorial: '',
      anioPublicacion: new Date().getFullYear(),
      copias: 1,
      disponibles: 1,
      ubicacion: '',
      descripcion: ''
    });

    toast({
      title: "Libro agregado",
      description: "El libro ha sido agregado correctamente al catálogo.",
    });
  };

  // Preparar libro para editar
  const handleEditarLibro = (libro: Book) => {
    setLibroEditando({...libro});
  };

  // Manejar cambios en el formulario de edición
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!libroEditando) return;
    
    const { name, value } = e.target;
    setLibroEditando(prev => ({
      ...prev!,
      [name]: name === 'anioPublicacion' || name === 'copias' || name === 'disponibles' 
        ? parseInt(value, 10) 
        : value
    }));
  };

  // Guardar cambios de edición
  const handleGuardarEdicion = () => {
    if (!libroEditando) return;

    // Validar datos mínimos
    if (!libroEditando.titulo || !libroEditando.autor || !libroEditando.isbn || !libroEditando.categoria) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    // Actualizar libro
    setLibros(prev => 
      prev.map(libro => 
        libro.id === libroEditando.id ? libroEditando : libro
      )
    );

    // Limpiar estado
    setLibroEditando(null);

    toast({
      title: "Libro actualizado",
      description: "El libro ha sido actualizado correctamente.",
    });
  };

  // Confirmar eliminación de libro
  const handleConfirmarEliminar = () => {
    if (!libroAEliminar) return;

    // Eliminar libro
    setLibros(prev => prev.filter(libro => libro.id !== libroAEliminar));
    
    // Limpiar estado
    setLibroAEliminar(null);

    toast({
      title: "Libro eliminado",
      description: "El libro ha sido eliminado correctamente del catálogo.",
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-6">Gestión de Libros</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 bg-gray-300 rounded-full mb-4"></div>
              <div className="h-6 w-48 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BookPlus className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Gestión de Libros</h1>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar libro
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Agregar nuevo libro</DialogTitle>
                <DialogDescription>
                  Ingresa la información del nuevo libro.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label htmlFor="titulo" className="text-right">
                    Título <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    value={nuevoLibro.titulo}
                    onChange={handleNuevoLibroChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="autor" className="text-right">
                    Autor <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="autor"
                    name="autor"
                    value={nuevoLibro.autor}
                    onChange={handleNuevoLibroChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="isbn" className="text-right">
                    ISBN <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="isbn"
                    name="isbn"
                    value={nuevoLibro.isbn}
                    onChange={handleNuevoLibroChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="categoria" className="text-right">
                    Categoría <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    name="categoria" 
                    value={nuevoLibro.categoria} 
                    onValueChange={(value) => setNuevoLibro(prev => ({ ...prev, categoria: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                      <SelectItem value="Nueva Categoría">Nueva Categoría</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="editorial" className="text-right">
                    Editorial
                  </Label>
                  <Input
                    id="editorial"
                    name="editorial"
                    value={nuevoLibro.editorial}
                    onChange={handleNuevoLibroChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="anioPublicacion" className="text-right">
                    Año de publicación
                  </Label>
                  <Input
                    id="anioPublicacion"
                    name="anioPublicacion"
                    type="number"
                    value={nuevoLibro.anioPublicacion}
                    onChange={handleNuevoLibroChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="copias" className="text-right">
                    Número de copias
                  </Label>
                  <Input
                    id="copias"
                    name="copias"
                    type="number"
                    min="1"
                    value={nuevoLibro.copias}
                    onChange={handleNuevoLibroChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="disponibles" className="text-right">
                    Disponibles
                  </Label>
                  <Input
                    id="disponibles"
                    name="disponibles"
                    type="number"
                    min="0"
                    max={nuevoLibro.copias || 1}
                    value={nuevoLibro.disponibles}
                    onChange={handleNuevoLibroChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="ubicacion" className="text-right">
                    Ubicación
                  </Label>
                  <Input
                    id="ubicacion"
                    name="ubicacion"
                    value={nuevoLibro.ubicacion}
                    onChange={handleNuevoLibroChange}
                    className="mt-1"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="descripcion" className="text-right">
                    Descripción
                  </Label>
                  <Textarea
                    id="descripcion"
                    name="descripcion"
                    value={nuevoLibro.descripcion}
                    onChange={handleNuevoLibroChange}
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" onClick={handleAgregarLibro}>Agregar libro</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Buscar por título, autor o ISBN..."
                  className="pl-8"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
            
            <div>
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
            
            <div className="flex items-end">
              <Button variant="outline" onClick={limpiarFiltros} className="w-full">
                <FilterX className="h-4 w-4 mr-2" />
                Limpiar filtros
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600">
            Mostrando {librosFiltrados.length} {librosFiltrados.length === 1 ? 'libro' : 'libros'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Disponibles/Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {librosFiltrados.length > 0 ? (
                librosFiltrados.map((libro) => (
                  <TableRow key={libro.id}>
                    <TableCell className="font-medium">
                      {libro.titulo}
                    </TableCell>
                    <TableCell>
                      {libro.autor}
                    </TableCell>
                    <TableCell>
                      {libro.categoria}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{libro.isbn}</span>
                    </TableCell>
                    <TableCell>
                      {libro.anioPublicacion}
                    </TableCell>
                    <TableCell>
                      <span className={`${libro.disponibles === 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {libro.disponibles}/{libro.copias}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEditarLibro(libro)}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Editar libro</DialogTitle>
                              <DialogDescription>
                                Actualiza la información del libro.
                              </DialogDescription>
                            </DialogHeader>
                            
                            {libroEditando && (
                              <>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                  <div className="col-span-2">
                                    <Label htmlFor="edit-titulo" className="text-right">
                                      Título <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id="edit-titulo"
                                      name="titulo"
                                      value={libroEditando.titulo}
                                      onChange={handleEditChange}
                                      className="mt-1"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="edit-autor" className="text-right">
                                      Autor <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id="edit-autor"
                                      name="autor"
                                      value={libroEditando.autor}
                                      onChange={handleEditChange}
                                      className="mt-1"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="edit-isbn" className="text-right">
                                      ISBN <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                      id="edit-isbn"
                                      name="isbn"
                                      value={libroEditando.isbn}
                                      onChange={handleEditChange}
                                      className="mt-1"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="edit-categoria" className="text-right">
                                      Categoría <span className="text-red-500">*</span>
                                    </Label>
                                    <Select 
                                      name="categoria" 
                                      value={libroEditando.categoria} 
                                      onValueChange={(value) => setLibroEditando(prev => ({ ...prev!, categoria: value }))}
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Selecciona una categoría" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {categorias.map((cat) => (
                                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                        <SelectItem value="Nueva Categoría">Nueva Categoría</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="edit-editorial" className="text-right">
                                      Editorial
                                    </Label>
                                    <Input
                                      id="edit-editorial"
                                      name="editorial"
                                      value={libroEditando.editorial}
                                      onChange={handleEditChange}
                                      className="mt-1"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="edit-anioPublicacion" className="text-right">
                                      Año de publicación
                                    </Label>
                                    <Input
                                      id="edit-anioPublicacion"
                                      name="anioPublicacion"
                                      type="number"
                                      value={libroEditando.anioPublicacion}
                                      onChange={handleEditChange}
                                      className="mt-1"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="edit-copias" className="text-right">
                                      Número de copias
                                    </Label>
                                    <Input
                                      id="edit-copias"
                                      name="copias"
                                      type="number"
                                      min="1"
                                      value={libroEditando.copias}
                                      onChange={handleEditChange}
                                      className="mt-1"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="edit-disponibles" className="text-right">
                                      Disponibles
                                    </Label>
                                    <Input
                                      id="edit-disponibles"
                                      name="disponibles"
                                      type="number"
                                      min="0"
                                      max={libroEditando.copias}
                                      value={libroEditando.disponibles}
                                      onChange={handleEditChange}
                                      className="mt-1"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="edit-ubicacion" className="text-right">
                                      Ubicación
                                    </Label>
                                    <Input
                                      id="edit-ubicacion"
                                      name="ubicacion"
                                      value={libroEditando.ubicacion}
                                      onChange={handleEditChange}
                                      className="mt-1"
                                    />
                                  </div>
                                  
                                  <div className="col-span-2">
                                    <Label htmlFor="edit-descripcion" className="text-right">
                                      Descripción
                                    </Label>
                                    <Textarea
                                      id="edit-descripcion"
                                      name="descripcion"
                                      value={libroEditando.descripcion || ''}
                                      onChange={handleEditChange}
                                      className="mt-1"
                                      rows={4}
                                    />
                                  </div>
                                </div>
                                
                                <DialogFooter>
                                  <Button type="submit" onClick={handleGuardarEdicion}>Guardar cambios</Button>
                                </DialogFooter>
                              </>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => setLibroAEliminar(libro.id)}
                            >
                              <Trash className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar libro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El libro será eliminado permanentemente del catálogo.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setLibroAEliminar(null)}>
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={handleConfirmarEliminar}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-gray-300 mb-2" />
                      <span className="text-gray-500">
                        No se encontraron libros con los filtros actuales
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
};

export default GestionLibros;
