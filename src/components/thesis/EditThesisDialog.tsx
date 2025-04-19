import React, { useState, useEffect } from 'react';
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
  const { uploadThesisFile, isUploading, uploadProgress } = useThesisFileUpload();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingThesis, setEditingThesis] = useState<Thesis | null>(thesis);

  useEffect(() => {
    setEditingThesis(thesis);
    setSelectedFile(null);
  }, [thesis]);

  const handleChange = (field: string, value: any) => {
    if (!editingThesis) return;
    
    setEditingThesis(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleSave = async () => {
    if (!editingThesis) return;
    
    try {
      let publicUrl = editingThesis.archivoPdf;

      if (selectedFile) {
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
  };

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
