
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Book } from '@/types';
import { DigitalBook } from '@/types/digitalBook';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DigitalBooksTable } from './DigitalBooksTable';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

interface DigitalBooksDialogProps {
  book: Book;
  digitalBooks: DigitalBook[];
  onAddDigitalBook?: (bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => void;
  onDeleteDigitalBook?: (id: string) => void;
  onEditDigitalBook?: (id: string, data: Partial<DigitalBook>) => void;
}

export function DigitalBooksDialog({ 
  book, 
  digitalBooks, 
  onDeleteDigitalBook,
  onEditDigitalBook 
}: DigitalBooksDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleOpenDialog = () => {
    if (!isAuthenticated) {
      toast({
        title: "Acceso restringido",
        description: "Debes iniciar sesión para acceder a los libros digitales.",
        variant: "destructive",
      });
      return;
    }
    setOpen(true);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title={`Archivos digitales de "${book.titulo}"`}
      trigger={
        <Button 
          variant="ghost" 
          className="flex w-full items-center justify-start"
          onClick={handleOpenDialog}
        >
          <FileText className="mr-2 h-4 w-4" />
          Archivos digitales
        </Button>
      }
      className="sm:max-w-[850px]"
    >
      {!isAuthenticated ? (
        <div className="py-6 text-center text-muted-foreground">
          Debe iniciar sesión para ver los archivos digitales.
        </div>
      ) : (
        <div className="space-y-4">
          <DigitalBooksTable
            book={book}
            digitalBooks={digitalBooks}
            onDeleteDigitalBook={onDeleteDigitalBook}
            onEditDigitalBook={onEditDigitalBook}
          />
          <div className="text-sm text-muted-foreground">
            Total de archivos: {digitalBooks.filter(db => db.bookId === book.id).length}
          </div>
        </div>
      )}
    </ResponsiveDialog>
  );
}
