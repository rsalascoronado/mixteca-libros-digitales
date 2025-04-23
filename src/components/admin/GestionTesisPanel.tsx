
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import type { Thesis } from "@/types";
import AddThesisDialog from "@/components/thesis/AddThesisDialog";
import EditThesisDialog from "@/components/thesis/EditThesisDialog";
import { useThesisFileUpload } from "@/hooks/useThesisFileUpload";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTheses, deleteThesis } from "@/lib/theses-db";
import { createStorageBuckets } from "@/utils/createStorageBucket";
import { useAuth } from "@/contexts/AuthContext";
import { isStaffUser } from "@/lib/user-utils";
import GestionTesisHeader from "./GestionTesisHeader";
import GestionTesisActions from "./GestionTesisActions";
import GestionTesisFilters from "./GestionTesisFilters";
import GestionTesisSummary from "./GestionTesisSummary";
import GestionTesisTableSection from "./GestionTesisTableSection";

interface GestionTesisPanelProps {
  isAuthenticated: boolean;
}

const GestionTesisPanel = ({ isAuthenticated }: GestionTesisPanelProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { deleteThesisFile } = useThesisFileUpload();
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTesis, setEditingTesis] = useState<Thesis | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { user } = useAuth();

  const userIsStaff = isStaffUser(user);
  const isDev = import.meta.env.DEV || import.meta.env.MODE === 'development';
  const canManageThesis = userIsStaff || isDev;

  useEffect(() => {
    if (isAuthenticated || isDev) {
      createStorageBuckets();
    }
  }, [isAuthenticated, isDev]);

  const { data: tesis = [], isLoading } = useQuery({
    queryKey: ["theses"],
    queryFn: fetchTheses,
    enabled: isAuthenticated || isDev,
  });

  const limpiarFiltros = () => {
    setBusqueda('');
    setTipoFiltro('');
  };

  const tesisFiltradas = tesis.filter((tesis) => {
    let cumpleBusqueda = true;
    let cumpleTipo = true;
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      cumpleBusqueda =
        tesis.titulo.toLowerCase().includes(busquedaLower) ||
        tesis.autor.toLowerCase().includes(busquedaLower) ||
        tesis.director.toLowerCase().includes(busquedaLower);
    }
    if (tipoFiltro && tipoFiltro !== "all") {
      cumpleTipo = tesis.tipo === tipoFiltro;
    }
    return cumpleBusqueda && cumpleTipo;
  });

  const handleThesisAdded = async (newThesis: Thesis) => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["theses"] });
      toast({
        title: "Tesis agregada",
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
      await queryClient.invalidateQueries({ queryKey: ["theses"] });
      setEditingTesis(null);
      toast({
        title: "Tesis actualizada",
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
      if (thesisToDelete.archivoPdf) {
        await deleteThesisFile(thesisToDelete.archivoPdf);
      }
      await deleteThesis(thesisToDelete.id);
      await queryClient.invalidateQueries({ queryKey: ["theses"] });
      toast({
        title: "Tesis eliminada",
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
    if (!canManageThesis) {
      toast({
        title: "Acceso denegado",
        description: "Solo bibliotecarios y administradores pueden editar tesis.",
        variant: "destructive"
      });
      return;
    }
    
    setEditingTesis(thesis);
    setEditDialogOpen(true);
  };

  const handleImportTesis = async (importedData: any[]) => {
    let successCount = 0;
    let failCount = 0;
    toast({
      title: "Importación de tesis",
      description: `Tesis importadas: ${successCount}, Fallos: ${failCount}`,
    });

    queryClient.invalidateQueries({ queryKey: ["theses"] });
  };

  if (!canManageThesis && !isDev) {
    return (
      <div className="container mx-auto py-10 px-4">
        <GestionTesisHeader />
        <div className="bg-destructive/10 p-4 rounded-lg border border-destructive">
          <h2 className="text-lg font-semibold text-destructive mb-2">Acceso denegado</h2>
          <p>Solo los bibliotecarios y administradores pueden acceder a la gestión de tesis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-2 sm:py-10 sm:px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <GestionTesisHeader />
        <GestionTesisActions
          onImport={handleImportTesis}
          exportData={tesisFiltradas}
          onAdd={() => setAddDialogOpen(true)}
        />
      </div>
      <div>
        <GestionTesisFilters
          busqueda={busqueda}
          tipoFiltro={tipoFiltro}
          onBusquedaChange={setBusqueda}
          onTipoFiltroChange={setTipoFiltro}
          onLimpiarFiltros={limpiarFiltros}
        />
        <GestionTesisSummary count={tesisFiltradas.length} isLoading={isLoading} />
      </div>
      <GestionTesisTableSection
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
  );
};

export default GestionTesisPanel;
