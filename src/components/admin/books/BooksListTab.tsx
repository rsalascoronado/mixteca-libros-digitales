
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
import { EditBookDialog } from '@/components/admin/EditBookDialog';
import { DigitalBooksDialog } from '@/components/admin/digital-books/DigitalBooksDialog';
import { BookActionsMenu } from './BookActionsMenu';

interface BooksListTabProps {
  books: Book[];
  categories: BookCategory[];
  digitalBooks: DigitalBook[];
  onDeleteBook: (id: string) => void;
  onEditBook: (id: string, data: Partial<Book>) => void;
  onDeleteDigitalBook?: (id: string) => void;
}

export function BooksListTab({ 
  books, 
  categories, 
  digitalBooks,
  onDeleteBook,
  onEditBook,
  onDeleteDigitalBook
}: BooksListTabProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredBooks = React.useMemo(() => {
    return books.filter(book => 
      book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
    );
  }, [books, searchTerm]);

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
                    onDeleteDigitalBook={onDeleteDigitalBook}
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
