
import React from 'react';
import { Book, BookCategory } from '@/types';
import { DigitalBook } from '@/types/digitalBook';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookActionsMenu } from './BookActionsMenu';

interface BooksTableProps {
  books: Book[];
  categories: BookCategory[];
  digitalBooks: DigitalBook[];
  onDeleteBook: (id: string) => void;
  onEditBook: (id: string, data: Partial<Book>) => void;
  onDeleteDigitalBook?: (id: string) => void;
  onAddDigitalBook?: (bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => void;
  onEditDigitalBook?: (id: string, data: Partial<DigitalBook>) => void;
}

export function BooksTable({
  books,
  categories,
  digitalBooks,
  onDeleteBook,
  onEditBook,
  onDeleteDigitalBook,
  onAddDigitalBook,
  onEditDigitalBook
}: BooksTableProps) {
  return (
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
          {books.map((book) => (
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
  );
}

