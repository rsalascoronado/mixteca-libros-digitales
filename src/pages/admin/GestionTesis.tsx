
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Thesis, mockTheses } from '@/types';
import DataExport from '@/components/admin/DataExport';
import DataImport from '@/components/admin/DataImport';
import ThesisTable from '@/components/thesis/ThesisTable';
import ThesisSearch from '@/components/thesis/ThesisSearch';
import AddThesisDialog from '@/components/thesis/AddThesisDialog';
import EditThesisDialog from '@/components/thesis/EditThesisDialog';
import { useToast } from '@/hooks/use-toast';
import { useThesisFileUpload } from '@/hooks/useThesisFileUpload';
import { useQuery } from "@tanstack/react-query";

// Define a type for the database thesis data structure
interface ThesisDBRow {
  id: string;
  titulo: string;
  autor: string;
  carrera: string;
  anio: number;
  director: string;
  tipo: string;
  disponible: boolean;
  resumen?: string;
  archivo_pdf?: string;
}

const GestionTesis = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const { deleteThesisFile } = useThesisFileUpload();
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTesis, setEditingTesis] = useState<Thesis | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // For now, use mockTheses since the theses table doesn't exist yet in Supabase
  const { data: tesis = [], isLoading, refetch } = useQuery({
    queryKey: ['theses'],
    queryFn: async () => {
      try {
        // For now we'll use mock data until we create the theses table
        return [...mockTheses];
      } catch (error) {
        console.error('Error al cargar tesis:', error);
        return [...mockTheses];
      }
    }
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
      cumpleBusqueda = tesis.titulo.toLowerCase().includes(busquedaLower) || 
                       tesis.autor.toLowerCase().includes(busquedaLower) || 
                       tesis.director.toLowerCase().includes(busquedaLower);
    }
    if (tipoFiltro) {
      cumpleTipo = tesis.tipo === tipoFiltro;
    }
    return cumpleBusqueda && cumpleTipo;
  });

  const handleThesisAdded = async (newThesis: Thesis) => {
    try {
      // For now, we'll just update the UI without actually storing in the database
      // This will be implemented when we create the theses table
      refetch();
      
      toast({
        title: 'Tesis agregada',
        description: `La tesis "${newThesis.titulo}" ha sido agregada exitosamente.`,
      });
    } catch (error) {
      console.error('Error al agregar tesis:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar la tesis. Intente nuevamente.',
        variant: 'destructive'
      });
    }
  };

  const handleThesisUpdated = async (updatedThesis: Thesis) => {
    try {
      // For now, we'll just update the UI without actually storing in the database
      // This will be implemented when we create the theses table
      refetch();
      setEditingTesis(null);
      
      toast({
        title: 'Tesis actualizada',
        description: `La tesis "${updatedThesis.titulo}" ha sido actualizada exitosamente.`,
      });
    } catch (error) {
      console.error('Error al actualizar tesis:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la tesis. Intente nuevamente.',
        variant: 'destructive'
      });
    }
  };

  const handleThesisDelete = async (thesisToDelete: Thesis) => {
    try {
      // Delete PDF file if it exists
      if (thesisToDelete.archivoPdf) {
        await deleteThesisFile(thesisToDelete.archivoPdf);
      }

      // For now, we'll just update the UI without actually deleting from the database
      // This will be implemented when we create the theses table
      refetch();

      toast({
        title: 'Tesis eliminada',
        description: `La tesis "${thesisToDelete.titulo}" ha sido eliminada exitosamente.`,
      });
    } catch (error) {
      console.error('Error al eliminar tesis:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la tesis. Intente nuevamente.',
        variant: 'destructive'
      });
    }
  };

  const handleEditTesis = (thesis: Thesis) => {
    setEditingTesis(thesis);
    setEditDialogOpen(true);
  };

  const handleImportTesis = async (importedData: any[]) => {
    let successCount = 0;
    let failCount = 0;
    
    // For now, we'll just update the UI without actually importing to the database
    // This will be implemented when we create the theses table
    
    toast({
      title: "Importación de tesis",
      description: `Tesis importadas: ${successCount}, Fallos: ${failCount}`
    });
    
    // Refresh data 
    refetch();
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <GraduationCap className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Gestión de Tesis</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <DataImport onImport={handleImportTesis} accept=".csv,.json,.xlsx" />
            <DataExport 
              data={tesisFiltradas} 
              filename="tesis-export" 
              buttonLabel="Exportar tesis"
            />
            <Button onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar tesis
            </Button>
          </div>
        </div>

        <ThesisSearch
          busqueda={busqueda}
          tipoFiltro={tipoFiltro}
          onBusquedaChange={setBusqueda}
          onTipoFiltroChange={setTipoFiltro}
          onLimpiarFiltros={limpiarFiltros}
        />

        <div className="mb-4">
          <p className="text-gray-600">
            Mostrando {tesisFiltradas.length} {tesisFiltradas.length === 1 ? 'tesis' : 'tesis'}
            {isLoading && ' (Cargando...)'}
          </p>
        </div>

        <ThesisTable
          theses={tesisFiltradas}
          onEdit={handleEditTesis}
          onDelete={handleThesisDelete}
        />

        <AddThesisDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onThesisAdded={handleThesisAdded}
        />

        <EditThesisDialog
          thesis={editingTesis}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onThesisUpdated={handleThesisUpdated}
        />
      </div>
    </MainLayout>
  );
};

export default GestionTesis;
