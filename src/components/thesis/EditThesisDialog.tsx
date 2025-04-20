
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Thesis } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ThesisForm } from './ThesisForm';
import { useThesisFileUpload } from '@/hooks/useThesisFileUpload';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

interface EditThesisDialogProps {
  thesis: Thesis | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onThesisUpdated: (thesis: Thesis) => void;
}

const EditThesisDialog = ({ thesis, open, onOpenChange, onThesisUpdated }: EditThesisDialogProps) => {
  const { toast } = useToast();
  const { uploadThesisFile, deleteThesisFile, isUploading, uploadProgress } = useThesisFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingThesis, setEditingThesis] = useState<Thesis | null>(thesis);
  
  // Reset state when thesis changes
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
    
    try {
      let publicUrl = editingThesis.archivoPdf;

      if (selectedFile) {
        // Si ya había un archivo, eliminarlo primero
        if (publicUrl) {
          try {
            await deleteThesisFile(publicUrl);
          } catch (error) {
            console.warn('Error deleting previous file:', error);
            // Continuar con la actualización incluso si falla la eliminación
          }
        }
        
        publicUrl = await uploadThesisFile(selectedFile, editingThesis.id);
      }

      const updatedThesis = {
        ...editingThesis,
        archivoPdf: publicUrl
      };

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
  }, [editingThesis, selectedFile, deleteThesisFile, uploadThesisFile, onThesisUpdated, onOpenChange, toast]);

  if (!editingThesis) return null;

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Editar tesis"
      description="Modifica la información de la tesis."
      footer={
        <Button 
          onClick={handleSave}
          disabled={isUploading}
        >
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
      />
    </ResponsiveDialog>
  );
};

export default EditThesisDialog;
