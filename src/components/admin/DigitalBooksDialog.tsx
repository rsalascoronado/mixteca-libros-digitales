import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, File, BookOpen, Eye, Trash2, FileBox, PencilIcon } from 'lucide-react';
import { DigitalBook } from '@/types/digitalBook';
import { Book } from '@/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import PDFViewer from '../shared/PDFViewer';
import { useToast } from '@/hooks/use-toast';
import { EditDigitalBookDialog } from './EditDigitalBookDialog';

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
  onAddDigitalBook, 
  onDeleteDigitalBook,
  onEditDigitalBook 
}: DigitalBooksDialogProps) {
  const [open, setOpen] = useState(false);
  const { hasRole, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const isStaff = hasRole(['administrador', 'bibliotecario']);

  const bookDigitalVersions = digitalBooks.filter(db => db.bookId === book.id);

  const handleDeleteVersion = (id: string) => {
    if (onDeleteDigitalBook) {
      onDeleteDigitalBook(id);
    }
  };

  const handleEditVersion = (id: string, data: Partial<DigitalBook>) => {
    if (onEditDigitalBook) {
      onEditDigitalBook(id, data);
    }
  };

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

  const getFormatIcon = (formato: string) => {
    switch (formato) {
      case 'PDF': return <FileText className="h-4 w-4 text-red-500" />;
      case 'EPUB': return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'MOBI': return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'HTML': return <FileBox className="h-4 w-4 text-purple-500" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1) {
      return `${(size * 1024).toFixed(2)} KB`;
    }
    return `${size.toFixed(2)} MB`;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex w-full items-center justify-start"
            onClick={handleOpenDialog}
          >
            <FileText className="mr-2 h-4 w-4" />
            Archivos digitales
          </Button>
        </DialogTrigger>
        {isAuthenticated && (
          <DialogContent className="sm:max-w-[850px]">
            <DialogHeader>
              <DialogTitle>Archivos digitales de "{book.titulo}"</DialogTitle>
            </DialogHeader>
            
            {bookDigitalVersions.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground">
                No hay archivos digitales disponibles para este libro.
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Formato</TableHead>
                      <TableHead>Archivo</TableHead>
                      <TableHead>Tamaño</TableHead>
                      <TableHead>Fecha subida</TableHead>
                      <TableHead>Resumen</TableHead>
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
                        <TableCell className="max-w-[200px]">
                          <div className="truncate" title={digitalBook.url}>
                            {new URL(digitalBook.url).pathname.split('/').pop()}
                          </div>
                        </TableCell>
                        <TableCell>{formatFileSize(digitalBook.tamanioMb)}</TableCell>
                        <TableCell>
                          {format(new Date(digitalBook.fechaSubida), 'PPP', { locale: es })}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="truncate" title={digitalBook.resumen}>
                            {digitalBook.resumen || 'Sin resumen'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <PDFViewer 
                              url={digitalBook.url} 
                              fileName={`${book.titulo} - ${digitalBook.formato}`} 
                            />
                            {isStaff && (
                              <>
                                <EditDigitalBookDialog
                                  digitalBook={digitalBook}
                                  onEdit={(data) => handleEditVersion(digitalBook.id, data)}
                                />
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
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="text-sm text-muted-foreground">
                  Total de archivos: {bookDigitalVersions.length}
                </div>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
