
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, File, BookOpen, Eye, Trash2 } from 'lucide-react';
import { DigitalBook } from '@/types/digitalBook';
import { Book } from '@/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DigitalBooksDialogProps {
  book: Book;
  digitalBooks: DigitalBook[];
  onAddDigitalBook?: (bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => void;
  onDeleteDigitalBook?: (id: string) => void;
}

export function DigitalBooksDialog({ book, digitalBooks, onAddDigitalBook, onDeleteDigitalBook }: DigitalBooksDialogProps) {
  const [open, setOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<DigitalBook | null>(null);

  const bookDigitalVersions = digitalBooks.filter(db => db.bookId === book.id);

  const handleViewBook = (digitalBook: DigitalBook) => {
    setSelectedBook(digitalBook);
    setViewerOpen(true);
  };

  const handleDeleteVersion = (id: string) => {
    if (onDeleteDigitalBook) {
      onDeleteDigitalBook(id);
    }
  };

  const getFormatIcon = (formato: string) => {
    switch (formato) {
      case 'PDF': return <FileText className="h-4 w-4 text-red-500" />;
      case 'EPUB': return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'MOBI': return <BookOpen className="h-4 w-4 text-green-500" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const handleDownload = (digitalBook: DigitalBook) => {
    const link = document.createElement('a');
    link.href = digitalBook.url;
    link.download = `${book.titulo}.${digitalBook.formato.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="flex w-full items-center justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Libros digitales
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Versiones digitales de "{book.titulo}"</DialogTitle>
          </DialogHeader>
          
          {bookDigitalVersions.length === 0 ? (
            <div className="py-6 text-center text-muted-foreground">
              No hay versiones digitales disponibles para este libro.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Formato</TableHead>
                  <TableHead>Tamaño</TableHead>
                  <TableHead>Fecha subida</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookDigitalVersions.map((digitalBook) => (
                  <TableRow key={digitalBook.id}>
                    <TableCell>
                      <div className="flex items-center">
                        {getFormatIcon(digitalBook.formato)}
                        <Badge variant="outline" className="ml-2">
                          {digitalBook.formato}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{digitalBook.tamanioMb} MB</TableCell>
                    <TableCell>
                      {format(new Date(digitalBook.fechaSubida), 'PPP', { locale: es })}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewBook(digitalBook)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(digitalBook)}
                        >
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Descargar</span>
                        </Button>
                        {onDeleteDigitalBook && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteVersion(digitalBook.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>

      {selectedBook && (
        <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
          <DialogContent className="sm:max-w-[900px] sm:h-[80vh]">
            <DialogHeader>
              <DialogTitle>
                Visualizando: {book.titulo} - {selectedBook.formato}
              </DialogTitle>
            </DialogHeader>
            <div className="h-full flex-1 overflow-hidden rounded border">
              <iframe 
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedBook.url)}&embedded=true`}
                className="w-full h-full"
                title={`${book.titulo} - ${selectedBook.formato}`}
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
