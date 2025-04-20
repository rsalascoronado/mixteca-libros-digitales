
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Thesis } from '@/types';
import DataExport from '@/components/admin/DataExport';
import DataImport from '@/components/admin/DataImport';
import ThesisTable from '@/components/thesis/ThesisTable';
import ThesisSearch from '@/components/thesis/ThesisSearch';
import AddThesisDialog from '@/components/thesis/AddThesisDialog';
import EditThesisDialog from '@/components/thesis/EditThesisDialog';
import { useToast } from '@/hooks/use-toast';
import { useThesisFileUpload } from '@/hooks/useThesisFileUpload';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTheses, deleteThesis } from '@/lib/db';

const GestionTesis = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const { deleteThesisFile } = useThesisFileUpload();
  const queryClient = useQueryClient();
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTesis, setEditingTesis] = useState<Thesis | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Obtener las tesis de la base de datos
  const { data: tesis = [], isLoading } = useQuery({
    queryKey: ['theses'],
    queryFn: fetchTheses
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
      // Invalidar la consulta de tesis para que se recarguen
      await queryClient.invalidateQueries({ queryKey: ['theses'] });
      
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
      // Invalidar la consulta de tesis para que se recarguen
      await queryClient.invalidateQueries({ queryKey: ['theses'] });
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
      // Eliminar el archivo PDF si existe
      if (thesisToDelete.archivoPdf) {
        await deleteThesisFile(thesisToDelete.archivoPdf);
      }

      // Eliminar la tesis de la base de datos
      await deleteThesis(thesisToDelete.id);
      
      // Invalidar la consulta de tesis para que se recarguen
      await queryClient.invalidateQueries({ queryKey: ['theses'] });

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
    
    // Implementación pendiente cuando se adapte la importación a la base de datos
    
    toast({
      title: "Importación de tesis",
      description: `Tesis importadas: ${successCount}, Fallos: ${failCount}`
    });
    
    // Refresh data 
    queryClient.invalidateQueries({ queryKey: ['theses'] });
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
