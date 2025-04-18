
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
  BookOpen, 
  Check, 
  Search, 
  FilterX, 
  Clock, 
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Prestamo, mockPrestamos, mockBooks, mockUsers } from '@/types';
import { format, parseISO, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';

const GestionPrestamos = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('all');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    // Verificar permisos
    if (!hasRole(['bibliotecario', 'administrador'])) {
      navigate('/');
      return;
    }

    // Cargar préstamos
    setLoading(true);
    setTimeout(() => {
      setPrestamos([...mockPrestamos]);
      setLoading(false);
    }, 500);
  }, [hasRole, navigate]);

  // Procesar préstamos para agregar info de usuario y libro
  const prestamosProcesados = prestamos.map(prestamo => {
    const usuario = mockUsers.find(user => user.id === prestamo.userId);
    const libro = mockBooks.find(book => book.id === prestamo.bookId);
    
    return {
      ...prestamo,
      usuario: usuario ? `${usuario.nombre} ${usuario.apellidos}` : 'Usuario desconocido',
      userEmail: usuario ? usuario.email : '',
      userRole: usuario ? usuario.role : '',
      libroTitulo: libro ? libro.titulo : 'Libro desconocido',
      vencido: isAfter(new Date(), prestamo.fechaDevolucion) && prestamo.estado === 'prestado'
    };
  });

  // Filtrar préstamos
  const prestamosFiltrados = prestamosProcesados.filter(prestamo => {
    let cumpleFiltroEstado = true;
    let cumpleBusqueda = true;
    
    // Filtro por estado
    if (filtroEstado && filtroEstado !== 'all') {
      if (filtroEstado === 'vencido') {
        cumpleFiltroEstado = prestamo.vencido || prestamo.estado === 'retrasado';
      } else {
        cumpleFiltroEstado = prestamo.estado === filtroEstado;
      }
    }
    
    // Filtro por búsqueda
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      cumpleBusqueda = 
        prestamo.libroTitulo.toLowerCase().includes(busquedaLower) ||
        prestamo.usuario.toLowerCase().includes(busquedaLower) ||
        prestamo.userEmail.toLowerCase().includes(busquedaLower);
    }
    
    return cumpleFiltroEstado && cumpleBusqueda;
  });

  const handleMarcarDevuelto = (prestamoId: string) => {
    // Marcar como devuelto
    setPrestamos(prev => 
      prev.map(prestamo => 
        prestamo.id === prestamoId 
          ? { ...prestamo, estado: 'devuelto' as const } 
          : prestamo
      )
    );
    
    toast({
      title: "Libro devuelto",
      description: "El libro ha sido marcado como devuelto correctamente.",
    });
  };

  const limpiarFiltros = () => {
    setFiltroEstado('all');
    setBusqueda('');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-6">Gestión de Préstamos</h1>
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
        <div className="flex items-center mb-6">
          <BookOpen className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold">Gestión de Préstamos</h1>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Buscar por título, usuario o correo..."
                  className="pl-8"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  <SelectItem value="prestado">Prestados</SelectItem>
                  <SelectItem value="devuelto">Devueltos</SelectItem>
                  <SelectItem value="retrasado">Retrasados</SelectItem>
                  <SelectItem value="vencido">Vencidos</SelectItem>
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
            Mostrando {prestamosFiltrados.length} {prestamosFiltrados.length === 1 ? 'préstamo' : 'préstamos'}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Libro</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Préstamo</TableHead>
                <TableHead>Devolución</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prestamosFiltrados.length > 0 ? (
                prestamosFiltrados.map((prestamo) => (
                  <TableRow 
                    key={prestamo.id}
                    className={
                      prestamo.vencido && prestamo.estado === 'prestado' 
                        ? 'bg-red-50' 
                        : prestamo.estado === 'retrasado'
                          ? 'bg-amber-50'
                          : prestamo.estado === 'devuelto'
                            ? 'bg-gray-50'
                            : ''
                    }
                  >
                    <TableCell className="font-medium">
                      {prestamo.libroTitulo}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{prestamo.usuario}</div>
                        <div className="text-xs text-gray-500">{prestamo.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">
                      {prestamo.userRole}
                    </TableCell>
                    <TableCell>
                      {format(new Date(prestamo.fechaPrestamo), 'PPP', { locale: es })}
                    </TableCell>
                    <TableCell className={prestamo.vencido && prestamo.estado !== 'devuelto' ? 'text-red-600 font-medium' : ''}>
                      {format(new Date(prestamo.fechaDevolucion), 'PPP', { locale: es })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {prestamo.estado === 'prestado' && !prestamo.vencido && (
                          <>
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                            <span>Prestado</span>
                          </>
                        )}
                        {prestamo.estado === 'prestado' && prestamo.vencido && (
                          <>
                            <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                            <span className="text-red-600">Vencido</span>
                          </>
                        )}
                        {prestamo.estado === 'retrasado' && (
                          <>
                            <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
                            <span className="text-amber-600">Retrasado</span>
                          </>
                        )}
                        {prestamo.estado === 'devuelto' && (
                          <>
                            <div className="h-2 w-2 rounded-full bg-gray-400 mr-2"></div>
                            <span>Devuelto</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {prestamo.estado !== 'devuelto' ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleMarcarDevuelto(prestamo.id)}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Marcar como devuelto
                        </Button>
                      ) : (
                        <span className="text-sm text-gray-500">Devuelto</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-gray-300 mb-2" />
                      <span className="text-gray-500">
                        No se encontraron préstamos con los filtros actuales
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

export default GestionPrestamos;
