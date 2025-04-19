
import React from 'react';
import { AlertTriangle, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Thesis } from '@/types';
import PDFViewer from '@/components/shared/PDFViewer';

interface ThesisTableProps {
  theses: Thesis[];
  onEdit: (thesis: Thesis) => void;
}

const ThesisTable = ({ theses, onEdit }: ThesisTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Carrera/posgrado</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Director</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>PDF</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {theses.length > 0 ? theses.map(thesis => (
            <TableRow key={thesis.id}>
              <TableCell className="font-medium">{thesis.titulo}</TableCell>
              <TableCell>{thesis.autor}</TableCell>
              <TableCell>{thesis.carrera}</TableCell>
              <TableCell>{thesis.tipo}</TableCell>
              <TableCell>{thesis.anio}</TableCell>
              <TableCell>{thesis.director}</TableCell>
              <TableCell>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${thesis.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {thesis.disponible ? 'Disponible' : 'No disponible'}
                </span>
              </TableCell>
              <TableCell>
                {thesis.archivoPdf ? (
                  <PDFViewer 
                    url={thesis.archivoPdf}
                    fileName={`${thesis.titulo}.pdf`}
                  />
                ) : (
                  <span className="text-gray-400">No disponible</span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(thesis)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-gray-300 mb-2" />
                  <span className="text-gray-500">
                    No se encontraron tesis con los filtros actuales
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ThesisTable;
