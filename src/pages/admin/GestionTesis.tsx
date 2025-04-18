
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Thesis, mockTheses } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { GraduationCap, Plus, Search, Pencil, Trash, FilterX, AlertTriangle } from 'lucide-react';

const GestionTesis = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [tesis, setTesis] = useState<Thesis[]>(mockTheses);
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  
  // Nueva tesis
  const [nuevaTesis, setNuevaTesis] = useState<Partial<Thesis>>({
    titulo: '',
    autor: '',
    carrera: '',
    anio: new Date().getFullYear(),
    director: '',
    tipo: 'Licenciatura',
    disponible: true
  });

  React.useEffect(() => {
    if (!hasRole(['bibliotecario', 'administrador'])) {
      navigate('/');
      return;
    }
  }, [hasRole, navigate]);

  const limpiarFiltros = () => {
    setBusqueda('');
    setTipoFiltro('');
  };

  const tesisFiltradas = tesis.filter(tesis => {
    let cumpleBusqueda = true;
    let cumpleTipo = true;
    
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      cumpleBusqueda = 
        tesis.titulo.toLowerCase().includes(busquedaLower) ||
        tesis.autor.toLowerCase().includes(busquedaLower) ||
        tesis.director.toLowerCase().includes(busquedaLower);
    }
    
    if (tipoFiltro) {
      cumpleTipo = tesis.tipo === tipoFiltro;
    }
    
    return cumpleBusqueda && cumpleTipo;
  });

  const handleNuevaTesis = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevaTesis(prev => ({
      ...prev,
      [name]: name === 'anio' ? parseInt(value) : value
    }));
  };

  const handleAgregarTesis = () => {
    if (!nuevaTesis.titulo || !nuevaTesis.autor || !nuevaTesis.carrera || !nuevaTesis.director) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const newId = (Math.max(...tesis.map(t => parseInt(t.id))) + 1).toString();
    const nuevaTesisCompleta: Thesis = {
      id: newId,
      titulo: nuevaTesis.titulo,
      autor: nuevaTesis.autor,
      carrera: nuevaTesis.carrera,
      anio: nuevaTesis.anio || new Date().getFullYear(),
      director: nuevaTesis.director,
      tipo: nuevaTesis.tipo as 'Licenciatura' | 'Maestría' | 'Doctorado',
      disponible: true,
      resumen: nuevaTesis.resumen
    };

    setTesis(prev => [...prev, nuevaTesisCompleta]);
    setNuevaTesis({
      titulo: '',
      autor: '',
      carrera: '',
      anio: new Date().getFullYear(),
      director: '',
      tipo: 'Licenciatura',
      disponible: true
    });

    toast({
      title: "Tesis agregada",
      description: "La tesis ha sido agregada correctamente al catálogo.",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Gestión de Tesis</h1>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar tesis
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Agregar nueva tesis</DialogTitle>
                <DialogDescription>
                  Ingresa la información de la nueva tesis.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
                  <Label htmlFor="titulo">
                    Título <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="titulo"
                    name="titulo"
                    value={nuevaTesis.titulo}
                    onChange={handleNuevaTesis}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="autor">
                    Autor <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="autor"
                    name="autor"
                    value={nuevaTesis.autor}
                    onChange={handleNuevaTesis}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="carrera">
                    Carrera <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="carrera"
                    name="carrera"
                    value={nuevaTesis.carrera}
                    onChange={handleNuevaTesis}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="director">
                    Director de tesis <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="director"
                    name="director"
                    value={nuevaTesis.director}
                    onChange={handleNuevaTesis}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tipo">
                    Tipo de tesis <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    name="tipo" 
                    value={nuevaTesis.tipo} 
                    onValueChange={(value) => setNuevaTesis(prev => ({ ...prev, tipo: value as 'Licenciatura' | 'Maestría' | 'Doctorado' }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Licenciatura">Licenciatura</SelectItem>
                      <SelectItem value="Maestría">Maestría</SelectItem>
                      <SelectItem value="Doctorado">Doctorado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="anio">
                    Año
                  </Label>
                  <Input
                    id="anio"
                    name="anio"
                    type="number"
                    value={nuevaTesis.anio}
                    onChange={handleNuevaTesis}
                    className="mt-1"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="resumen">
                    Resumen
                  </Label>
                  <Textarea
                    id="resumen"
                    name="resumen"
                    value={nuevaTesis.resumen}
                    onChange={handleNuevaTesis}
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit" onClick={handleAgregarTesis}>Agregar tesis</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Buscar por título, autor o director..."
                  className="pl-8"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los tipos</SelectItem>
                    <SelectItem value="Licenciatura">Licenciatura</SelectItem>
                    <SelectItem value="Maestría">Maestría</SelectItem>
                    <SelectItem value="Doctorado">Doctorado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" onClick={limpiarFiltros}>
                <FilterX className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600">
            Mostrando {tesisFiltradas.length} {tesisFiltradas.length === 1 ? 'tesis' : 'tesis'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Carrera</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Año</TableHead>
                <TableHead>Director</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tesisFiltradas.length > 0 ? (
                tesisFiltradas.map((tesis) => (
                  <TableRow key={tesis.id}>
                    <TableCell className="font-medium">{tesis.titulo}</TableCell>
                    <TableCell>{tesis.autor}</TableCell>
                    <TableCell>{tesis.carrera}</TableCell>
                    <TableCell>{tesis.tipo}</TableCell>
                    <TableCell>{tesis.anio}</TableCell>
                    <TableCell>{tesis.director}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        tesis.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tesis.disponible ? 'Disponible' : 'No disponible'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-gray-300 mb-2" />
                      <span className="text-gray-500">
                        No se encontraron tesis con los filtros actuales
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

export default GestionTesis;
