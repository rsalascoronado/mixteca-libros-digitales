
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Thesis } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ThesisForm } from './ThesisForm';
import { useThesisFileUpload } from '@/hooks/useThesisFileUpload';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { Save } from "lucide-react";
import { isStaffUser } from '@/lib/user-utils';

interface EditThesisDialogProps {
  thesis: Thesis | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onThesisUpdated: (thesis: Thesis) => void;
}

const EditThesisDialog = ({ thesis, open, onOpenChange, onThesisUpdated }: EditThesisDialogProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { saveThesisWithFile, deleteThesisFile, isUploading, uploadProgress } = useThesisFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingThesis, setEditingThesis] = useState<Thesis | null>(thesis);
  
  useEffect(() => {
    setEditingThesis(thesis);
    setSelectedFile(null);
  }, [thesis]);

  const handleChange = useCallback((field: string, value: any) => {
    if (!editingThesis) return;
    
    setEditingThesis(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  }, [editingThesis]);

  const handleSave = useCallback(async () => {
    if (!editingThesis) return;
    
    // Verificar si estamos en modo desarrollo
    const isDevMode = import.meta.env.DEV || import.meta.env.MODE === 'development';
    
    // Comprobar si el usuario es staff o si estamos en modo desarrollo
    const userIsStaff = isStaffUser(user);
    const canManageThesis = userIsStaff || isDevMode;
    
    if (!canManageThesis) {
      toast({
        title: "Acceso denegado",
        description: "Solo bibliotecarios y administradores pueden editar tesis.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Si se seleccionó un nuevo archivo y ya existía uno anterior, eliminar el anterior
      const shouldDeleteOldFile = selectedFile && editingThesis.archivoPdf;
      
      // Guardar la tesis con el nuevo archivo (si existe)
      const updatedThesis = await saveThesisWithFile(editingThesis, selectedFile || undefined);
      
      // Eliminar archivo anterior después de guardar exitosamente
      if (shouldDeleteOldFile) {
        try {
          await deleteThesisFile(editingThesis.archivoPdf);
        } catch (error) {
          console.warn('Error deleting previous file:', error);
          // No interrumpimos el flujo si falla la eliminación
        }
      }
      
      // Actualizar la UI y cerrar el diálogo
      onThesisUpdated(updatedThesis);
      onOpenChange(false);
      setSelectedFile(null);

      toast({
        title: "Tesis actualizada",
        description: "Los cambios han sido guardados correctamente."
      });
    } catch (error) {
      console.error('Error updating thesis:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudieron guardar los cambios.",
        variant: "destructive"
      });
    }
  }, [editingThesis, selectedFile, deleteThesisFile, saveThesisWithFile, onThesisUpdated, onOpenChange, toast, user]);

  const isStaff = isStaffUser(user);

  if (!editingThesis) return null;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={(newOpen) => {
        // Si está en proceso de carga, no permitir cerrar
        if (isUploading && !newOpen) return;
        onOpenChange(newOpen);
      }}
      title="Editar tesis"
      description="Modifica la información de la tesis."
      footer={
        <Button 
          onClick={handleSave}
          disabled={isUploading}
        >
          <Save className="mr-2 h-4 w-4" />
          {isUploading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      }
    >
      <ThesisForm
        thesis={editingThesis}
        onFileChange={setSelectedFile}
        onChange={handleChange}
        selectedFile={selectedFile}
        uploadProgress={isUploading ? uploadProgress : 0}
        isStaff={isStaff}
      />
    </ResponsiveDialog>
  );
};

export default EditThesisDialog;
