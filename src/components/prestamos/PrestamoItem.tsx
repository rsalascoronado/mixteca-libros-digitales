
import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { CheckCircle2 } from 'lucide-react';
import type { Prestamo } from '@/types';

interface PrestamoItemProps {
  prestamo: Prestamo & {
    usuario: string;
    userEmail: string;
    userRole: string;
    libroTitulo: string;
    vencido: boolean;
  };
  onMarcarDevuelto: (id: string) => void;
}

const PrestamoItem = ({ prestamo, onMarcarDevuelto }: PrestamoItemProps) => {
  return (
    <TableRow 
      className={
        prestamo.vencido && prestamo.estado === 'prestado' 
          ? 'bg-red-50' 
          : prestamo.estado === 'retrasado'
            ? 'bg-amber-50'
            : prestamo.estado === 'devuelto'
              ? 'bg-gray-50'
              : ''
      }
    >
      <TableCell className="font-medium">
        {prestamo.libroTitulo}
      </TableCell>
      <TableCell>
        <div>
          <div>{prestamo.usuario}</div>
          <div className="text-xs text-gray-500">{prestamo.userEmail}</div>
        </div>
      </TableCell>
      <TableCell className="capitalize">
        {prestamo.userRole}
      </TableCell>
      <TableCell>
        {format(new Date(prestamo.fechaPrestamo), 'PPP', { locale: es })}
      </TableCell>
      <TableCell className={prestamo.vencido && prestamo.estado !== 'devuelto' ? 'text-red-600 font-medium' : ''}>
        {format(new Date(prestamo.fechaDevolucion), 'PPP', { locale: es })}
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          {prestamo.estado === 'prestado' && !prestamo.vencido && (
            <>
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <span>Prestado</span>
            </>
          )}
          {prestamo.estado === 'prestado' && prestamo.vencido && (
            <>
              <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
              <span className="text-red-600">Vencido</span>
            </>
          )}
          {prestamo.estado === 'retrasado' && (
            <>
              <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-amber-600">Retrasado</span>
            </>
          )}
          {prestamo.estado === 'devuelto' && (
            <>
              <div className="h-2 w-2 rounded-full bg-gray-400 mr-2"></div>
              <span>Devuelto</span>
            </>
          )}
        </div>
      </TableCell>
      <TableCell>
        {prestamo.estado !== 'devuelto' ? (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onMarcarDevuelto(prestamo.id)}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Marcar como devuelto
          </Button>
        ) : (
          <span className="text-sm text-gray-500">Devuelto</span>
        )}
      </TableCell>
    </TableRow>
  );
};

export default PrestamoItem;
