
import React from 'react';
import { Book, BookCategory } from '@/types';
import { DigitalBook } from '@/types/digitalBook';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookActionsMenu } from './BookActionsMenu';

interface BooksListTabProps {
  books: Book[];
  categories: BookCategory[];
  digitalBooks: DigitalBook[];
  onDeleteBook: (id: string) => void;
  onEditBook: (id: string, data: Partial<Book>) => void;
  onDeleteDigitalBook?: (id: string) => void;
  onAddDigitalBook?: (bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => void;
  onEditDigitalBook?: (id: string, data: Partial<DigitalBook>) => void;
  showDigitalOnly?: boolean;
}

export function BooksListTab({ 
  books, 
  categories, 
  digitalBooks,
  onDeleteBook,
  onEditBook,
  onDeleteDigitalBook,
  onAddDigitalBook,
  onEditDigitalBook,
  showDigitalOnly = false
}: BooksListTabProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredBooks = React.useMemo(() => {
    let filteredList = books.filter(book => 
      book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
    );

    if (showDigitalOnly) {
      // Solo mostrar libros que tienen versiones digitales
      filteredList = filteredList.filter(book => 
        digitalBooks.some(db => db.bookId === book.id)
      );
    }

    return filteredList;
  }, [books, searchTerm, digitalBooks, showDigitalOnly]);

  return (
    <>
      <div className="flex items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por título, autor o ISBN..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Disponibles</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.titulo}</TableCell>
                <TableCell>{book.autor}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.categoria}</TableCell>
                <TableCell>{book.disponibles} / {book.copias}</TableCell>
                <TableCell>
                  <BookActionsMenu
                    book={book}
                    categories={categories}
                    digitalBooks={digitalBooks}
                    onDeleteBook={onDeleteBook}
                    onEditBook={onEditBook}
                    onAddDigitalBook={onAddDigitalBook}
                    onDeleteDigitalBook={onDeleteDigitalBook}
                    onEditDigitalBook={onEditDigitalBook}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
