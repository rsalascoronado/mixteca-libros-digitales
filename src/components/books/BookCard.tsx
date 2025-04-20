
import React from 'react';
import { Book } from '@/types/book';
import { Button } from '@/components/ui/button';
import PDFViewer from '@/components/shared/PDFViewer';
import { mockDigitalBooks } from '@/types/digitalBook';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  libro: Book;
}

const BookCard: React.FC<BookCardProps> = ({ libro }) => {
  const navigate = useNavigate();

  const hasDigitalVersion = (bookId: string) => {
    return mockDigitalBooks.some(digital => digital.bookId === bookId);
  };

  const getDigitalBookUrl = (bookId: string) => {
    const digitalBook = mockDigitalBooks.find(digital => digital.bookId === bookId);
    return digitalBook?.url || '';
  };

  const handleVerDetalles = (libroId: string) => {
    navigate(`/libro/${libroId}`);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-2">{libro.titulo}</h3>
      <p className="text-gray-600 mb-2">Autor: {libro.autor}</p>
      <p className="text-sm text-gray-500">Categoría: {libro.categoria}</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-gray-700">Disponibles: {libro.disponibles}</span>
        <div className="flex gap-2">
          {hasDigitalVersion(libro.id) && (
            <PDFViewer
              url={getDigitalBookUrl(libro.id)}
              fileName={`${libro.titulo}.pdf`}
            />
          )}
          <Button 
            size="sm" 
            onClick={() => handleVerDetalles(libro.id)}
          >
            Ver Detalles
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
