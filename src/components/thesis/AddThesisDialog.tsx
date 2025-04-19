
import React, { useState } from 'react';
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

interface AddThesisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onThesisAdded: (thesis: Thesis) => void;
}

const AddThesisDialog = ({ open, onOpenChange, onThesisAdded }: AddThesisDialogProps) => {
  const { toast } = useToast();
  const [nuevaTesis, setNuevaTesis] = useState<Partial<Thesis>>({
    titulo: '',
    autor: '',
    carrera: '',
    anio: new Date().getFullYear(),
    director: '',
    tipo: 'Licenciatura',
    disponible: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevaTesis(prev => ({
      ...prev,
      [name]: name === 'anio' ? parseInt(value) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast({
        title: "Error",
        description: "Por favor seleccione un archivo PDF válido",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!nuevaTesis.titulo || !nuevaTesis.autor || !nuevaTesis.carrera || !nuevaTesis.director) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Por favor seleccione un archivo PDF de la tesis",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Generate a unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `thesis-${Date.now()}.${fileExt}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('thesis-files')
        .upload(fileName, selectedFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Error al subir archivo: ${uploadError.message}`);
      }

      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('thesis-files')
        .getPublicUrl(fileName);

      // Create a new thesis with the PDF URL
      const newId = Date.now().toString();
      
      const nuevaTesisCompleta: Thesis = {
        id: newId,
        titulo: nuevaTesis.titulo || '',
        autor: nuevaTesis.autor || '',
        carrera: nuevaTesis.carrera || '',
        anio: nuevaTesis.anio || new Date().getFullYear(),
        director: nuevaTesis.director || '',
        tipo: nuevaTesis.tipo as 'Licenciatura' | 'Maestría' | 'Doctorado',
        disponible: true,
        resumen: nuevaTesis.resumen,
        archivoPdf: publicUrl
      };

      onThesisAdded(nuevaTesisCompleta);
      onOpenChange(false);
      setNuevaTesis({
        titulo: '',
        autor: '',
        carrera: '',
        anio: new Date().getFullYear(),
        director: '',
        tipo: 'Licenciatura',
        disponible: true
      });
      setSelectedFile(null);
      
      toast({
        title: "Tesis agregada",
        description: "La tesis ha sido agregada correctamente al catálogo."
      });
    } catch (error) {
      console.error('Error uploading thesis:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la tesis.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Agregar nueva tesis</DialogTitle>
          <DialogDescription>
            Ingresa la información de la nueva tesis.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="col-span-2">
            <Label htmlFor="titulo">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input id="titulo" name="titulo" value={nuevaTesis.titulo} onChange={handleChange} className="mt-1" />
          </div>
          
          <div>
            <Label htmlFor="autor">
              Autor <span className="text-red-500">*</span>
            </Label>
            <Input id="autor" name="autor" value={nuevaTesis.autor} onChange={handleChange} className="mt-1" />
          </div>
          
          <div>
            <Label htmlFor="carrera">
              Carrera <span className="text-red-500">*</span>
            </Label>
            <Input id="carrera" name="carrera" value={nuevaTesis.carrera} onChange={handleChange} className="mt-1" />
          </div>
          
          <div>
            <Label htmlFor="director">
              Director de tesis <span className="text-red-500">*</span>
            </Label>
            <Input id="director" name="director" value={nuevaTesis.director} onChange={handleChange} className="mt-1" />
          </div>
          
          <div>
            <Label htmlFor="tipo">
              Tipo de tesis <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={nuevaTesis.tipo} 
              onValueChange={value => setNuevaTesis(prev => ({
                ...prev,
                tipo: value as 'Licenciatura' | 'Maestría' | 'Doctorado'
              }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Licenciatura">Licenciatura</SelectItem>
                <SelectItem value="Maestría">Maestría</SelectItem>
                <SelectItem value="Doctorado">Doctorado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="anio">
              Año
            </Label>
            <Input 
              id="anio" 
              name="anio" 
              type="number" 
              value={nuevaTesis.anio} 
              onChange={handleChange} 
              className="mt-1" 
            />
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="resumen">
              Resumen
            </Label>
            <Textarea 
              id="resumen" 
              name="resumen" 
              value={nuevaTesis.resumen} 
              onChange={handleChange} 
              className="mt-1" 
              rows={4} 
            />
          </div>
          
          <div className="col-span-2">
            <Label htmlFor="archivoPdf">
              Archivo PDF de la tesis <span className="text-red-500">*</span>
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
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? 'Subiendo...' : 'Agregar tesis'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddThesisDialog;
