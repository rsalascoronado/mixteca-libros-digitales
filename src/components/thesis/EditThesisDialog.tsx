
import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Thesis } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EditThesisDialogProps {
  thesis: Thesis | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onThesisUpdated: (thesis: Thesis) => void;
}

const EditThesisDialog = ({ thesis, open, onOpenChange, onThesisUpdated }: EditThesisDialogProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingThesis, setEditingThesis] = useState<Thesis | null>(thesis);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setEditingThesis(thesis);
    setSelectedFile(null);
  }, [thesis]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingThesis) return;
    
    const { name, value } = e.target;
    setEditingThesis(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === 'anio' ? parseInt(value) : value
      };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else if (file) {
      toast({
        title: "Error",
        description: "Por favor seleccione un archivo PDF válido",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    if (!editingThesis) return;
    
    try {
      setIsUploading(true);
      let publicUrl = editingThesis.archivoPdf;

      if (selectedFile) {
        // Verificar si el bucket existe antes de intentar subir el archivo
        const { data: buckets, error: bucketError } = await supabase
          .storage
          .listBuckets();
        
        if (bucketError) {
          console.error('Error al verificar buckets:', bucketError);
          throw new Error(`Error al verificar almacenamiento: ${bucketError.message}`);
        }

        const bucketExists = buckets.some(bucket => bucket.id === 'thesis-files');
        if (!bucketExists) {
          throw new Error(`El bucket 'thesis-files' no existe. Por favor, contacte al administrador.`);
        }
        
        // Generate a unique filename for the updated file
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `thesis-edit-${editingThesis.id}-${Date.now()}.${fileExt}`;
        
        console.log('Iniciando carga de archivo actualizado:', fileName);
        
        // Upload the new file with public access settings
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('thesis-files')
          .upload(fileName, selectedFile, {
            cacheControl: '3600',
            upsert: false,
            contentType: 'application/pdf'
          });

        if (uploadError) {
          console.error('Error de carga:', uploadError);
          throw new Error(`Error al subir archivo: ${uploadError.message}`);
        }

        console.log('Archivo actualizado subido exitosamente:', uploadData);

        // Get the public URL for the new file
        const { data: { publicUrl: newPublicUrl } } = supabase.storage
          .from('thesis-files')
          .getPublicUrl(fileName);

        console.log('URL pública generada para archivo actualizado:', newPublicUrl);
        
        publicUrl = newPublicUrl;
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
    } finally {
      setIsUploading(false);
    }
  };

  if (!editingThesis) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar tesis</DialogTitle>
          <DialogDescription>
            Modifica la información de la tesis.
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
              value={editingThesis.titulo}
              onChange={handleChange}
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
              value={editingThesis.autor}
              onChange={handleChange}
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
              value={editingThesis.carrera}
              onChange={handleChange}
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
              value={editingThesis.director}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="tipo">
              Tipo de tesis <span className="text-red-500">*</span>
            </Label>
            <Select
              value={editingThesis.tipo}
              onValueChange={(value) =>
                setEditingThesis(prev => ({
                  ...prev!,
                  tipo: value as 'Licenciatura' | 'Maestría' | 'Doctorado'
                }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Licenciatura">Licenciatura</SelectItem>
                <SelectItem value="Maestría">Maestría</SelectItem>
                <SelectItem value="Doctorado">Doctorado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="anio">Año</Label>
            <Input
              id="anio"
              name="anio"
              type="number"
              value={editingThesis.anio}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="disponible">Estado</Label>
            <Select
              value={editingThesis.disponible.toString()}
              onValueChange={(value) =>
                setEditingThesis(prev => ({
                  ...prev!,
                  disponible: value === 'true'
                }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Disponible</SelectItem>
                <SelectItem value="false">No disponible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Label htmlFor="resumen">Resumen</Label>
            <Textarea
              id="resumen"
              name="resumen"
              value={editingThesis.resumen || ''}
              onChange={handleChange}
              className="mt-1"
              rows={4}
            />
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="archivoPdf">
              Archivo PDF de la tesis
            </Label>
            <div className="mt-1 flex items-center gap-4">
              <Input
                id="archivoPdf"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="flex-1"
              />
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Upload className="h-4 w-4" />
                  {selectedFile.name}
                </div>
              )}
              {!selectedFile && editingThesis.archivoPdf && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Upload className="h-4 w-4" />
                  PDF actual
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={handleSave}
            disabled={isUploading}
          >
            {isUploading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditThesisDialog;
