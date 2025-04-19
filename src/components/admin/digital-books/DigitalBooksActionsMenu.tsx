
import React from 'react';
import { EditDigitalBookDialog } from '../EditDigitalBookDialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { DigitalBook } from '@/types/digitalBook';

interface DigitalBooksActionsMenuProps {
  isStaff: boolean;
  digitalBook: DigitalBook;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, data: Partial<DigitalBook>) => void;
}

export function DigitalBooksActionsMenu({ 
  isStaff, 
  digitalBook, 
  onDelete,
  onEdit 
}: DigitalBooksActionsMenuProps) {
  if (!isStaff) return null;

  return (
    <>
      <EditDigitalBookDialog
        digitalBook={digitalBook}
        onEdit={(data) => onEdit?.(digitalBook.id, data)}
      />
      {onDelete && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(digitalBook.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Eliminar</span>
        </Button>
      )}
    </>
  );
}
