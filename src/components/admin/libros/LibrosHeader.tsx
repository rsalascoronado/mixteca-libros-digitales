
import React from 'react';
import { CardTitle, CardDescription, CardHeader } from '@/components/ui/card';
import DataImport from '@/components/admin/DataImport';
import DataExport from '@/components/admin/DataExport';
import { NewBookDialog } from '@/components/admin/NewBookDialog';
import { Book, BookCategory } from '@/types';

interface LibrosHeaderProps {
  books: Book[];
  categories: BookCategory[];
  onImport: (data: any[]) => void;
  onAddBook: (book: Omit<Book, 'id'>) => void;
}

const LibrosHeader: React.FC<LibrosHeaderProps> = ({
  books,
  categories,
  onImport,
  onAddBook
}) => {
  return (
    <CardHeader className="pb-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <CardTitle>Gestión de Libros</CardTitle>
          <CardDescription>
            Administra el catálogo de libros de la biblioteca
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <DataImport onImport={onImport} />
          <DataExport
            data={books}
            filename="libros-biblioteca"
            buttonLabel="Exportar libros"
          />
          <NewBookDialog
            categories={categories}
            onAddBook={onAddBook}
          />
        </div>
      </div>
    </CardHeader>
  );
};

export default LibrosHeader;
