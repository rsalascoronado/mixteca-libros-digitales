
import React from 'react';
import { Book, BookCategory } from '@/types';
import { DigitalBook } from '@/types/digitalBook';
import { BookSearch } from './BookSearch';
import { BooksTable } from './BooksTable';

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
      filteredList = filteredList.filter(book => 
        digitalBooks.some(db => db.bookId === book.id)
      );
    }

    return filteredList;
  }, [books, searchTerm, digitalBooks, showDigitalOnly]);

  return (
    <>
      <div className="flex items-center mb-4">
        <BookSearch 
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>
      
      <BooksTable 
        books={filteredBooks}
        categories={categories}
        digitalBooks={digitalBooks}
        onDeleteBook={onDeleteBook}
        onEditBook={onEditBook}
        onDeleteDigitalBook={onDeleteDigitalBook}
        onAddDigitalBook={onAddDigitalBook}
        onEditDigitalBook={onEditDigitalBook}
      />
    </>
  );
}

