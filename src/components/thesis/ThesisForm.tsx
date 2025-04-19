
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Thesis } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ThesisFormProps {
  thesis?: Partial<Thesis>;
  onFileChange: (file: File | null) => void;
  onChange: (field: string, value: any) => void;
  selectedFile: File | null;
}

export const ThesisForm = ({ thesis, onFileChange, onChange, selectedFile }: ThesisFormProps) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileChange(file);
    } else {
      toast({
        title: "Error",
        description: "Por favor seleccione un archivo PDF válido",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 py-4">
      <div className="col-span-2">
        <Label htmlFor="titulo">
          Título <span className="text-red-500">*</span>
        </Label>
        <Input 
          id="titulo" 
          name="titulo" 
          value={thesis?.titulo || ''} 
          onChange={(e) => onChange('titulo', e.target.value)} 
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
          value={thesis?.autor || ''} 
          onChange={(e) => onChange('autor', e.target.value)} 
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
          value={thesis?.carrera || ''} 
          onChange={(e) => onChange('carrera', e.target.value)} 
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
          value={thesis?.director || ''} 
          onChange={(e) => onChange('director', e.target.value)} 
          className="mt-1" 
        />
      </div>
      
      <div>
        <Label htmlFor="tipo">
          Tipo de tesis <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={thesis?.tipo || 'Licenciatura'} 
          onValueChange={(value) => onChange('tipo', value)}
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
          value={thesis?.anio || new Date().getFullYear()} 
          onChange={(e) => onChange('anio', parseInt(e.target.value))} 
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
          value={thesis?.resumen || ''} 
          onChange={(e) => onChange('resumen', e.target.value)} 
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
          {!selectedFile && thesis?.archivoPdf && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Upload className="h-4 w-4" />
              PDF actual
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
