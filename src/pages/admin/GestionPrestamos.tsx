
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockPrestamos, mockBooks, mockUsers } from '@/types';
import { isAfter } from 'date-fns';
import PrestamosFilter from '@/components/prestamos/PrestamosFilter';
import PrestamosList from '@/components/prestamos/PrestamosList';

const GestionPrestamos = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [prestamos, setPrestamos] = useState([]);
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
    
    if (filtroEstado && filtroEstado !== 'all') {
      if (filtroEstado === 'vencido') {
        cumpleFiltroEstado = prestamo.vencido || prestamo.estado === 'retrasado';
      } else {
        cumpleFiltroEstado = prestamo.estado === filtroEstado;
      }
    }
    
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

        <PrestamosFilter 
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          limpiarFiltros={limpiarFiltros}
        />
        
        <div className="mb-4">
          <p className="text-gray-600">
            Mostrando {prestamosFiltrados.length} {prestamosFiltrados.length === 1 ? 'préstamo' : 'préstamos'}
          </p>
        </div>

        <PrestamosList 
          prestamos={prestamosFiltrados} 
          onMarcarDevuelto={handleMarcarDevuelto}
        />
      </div>
    </MainLayout>
  );
};

export default GestionPrestamos;
