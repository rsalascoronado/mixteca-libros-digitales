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
import { supabase } from "@/integrations/supabase/client";

const GestionTesis = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const { deleteThesisFile } = useThesisFileUpload();
  const [tesis, setTesis] = useState<Thesis[]>(mockTheses);
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTesis, setEditingTesis] = useState<Thesis | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

  const handleThesisAdded = (newThesis: Thesis) => {
    setTesis(prev => [...prev, newThesis]);
  };

  const handleThesisUpdated = (updatedThesis: Thesis) => {
    setTesis(prev => prev.map(t => t.id === updatedThesis.id ? updatedThesis : t));
    setEditingTesis(null);
  };

  const handleThesisDelete = async (thesisToDelete: Thesis) => {
    try {
      // Delete PDF file if it exists
      if (thesisToDelete.archivoPdf) {
        await deleteThesisFile(thesisToDelete.archivoPdf);
      }

      // Remove thesis from list
      setTesis(prev => prev.filter(t => t.id !== thesisToDelete.id));

      toast({
        title: 'Tesis eliminada',
        description: `La tesis "${thesisToDelete.titulo}" ha sido eliminada exitosamente.`,
      });
    } catch (error) {
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
    for (const raw of importedData) {
      try {
        // Prevent duplicate thesis by title, director, or id
        const { data: existing } = await supabase.from("theses").select("id").eq("titulo", raw.titulo).maybeSingle();
        if (existing) continue;
        await supabase.from("theses").insert([{
          titulo: raw.titulo,
          autor: raw.autor,
          carrera: raw.carrera,
          anio: Number(raw.anio),
          director: raw.director,
          tipo: raw.tipo,
          disponible: raw.disponible === "true" || raw.disponible === true,
          resumen: raw.resumen,
          archivo_pdf: raw.archivoPdf || null
        }]);
        successCount++;
      } catch (e) {
        failCount++;
      }
    }
    toast({
      title: "Importación de tesis",
      description: `Tesis importadas: ${successCount}, Fallos: ${failCount}`
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
