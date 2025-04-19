import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Thesis } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ThesisFormProps {
  thesis?: Partial<Thesis>;
  onFileChange: (file: File | null) => void;
  onChange: (field: string, value: any) => void;
  selectedFile: File | null;
  uploadProgress?: number;
}

export const ThesisForm = ({ 
  thesis, 
  onFileChange, 
  onChange, 
  selectedFile,
  uploadProgress = 0
}: ThesisFormProps) => {
  const { toast } = useToast();
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) {
      return;
    }

    if (!file.type.includes('pdf')) {
      toast({
        title: "Error",
        description: "Por favor seleccione un archivo PDF válido",
        variant: "destructive"
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Error",
        description: "El archivo no debe exceder 100MB",
        variant: "destructive"
      });
      return;
    }

    onFileChange(file);
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
        <div className="mt-1 space-y-2">
          <Input
            id="archivoPdf"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="flex-1"
          />
          {selectedFile && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Upload className="h-4 w-4" />
                {selectedFile.name}
              </div>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-1">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-muted-foreground">
                    Subiendo... {uploadProgress}%
                  </p>
                </div>
              )}
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
