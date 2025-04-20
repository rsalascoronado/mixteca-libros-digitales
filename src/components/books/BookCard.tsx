
import React from 'react';
import { Book } from '@/types/book';
import { Button } from '@/components/ui/button';
import DigitalFilesButtonGroup from './DigitalFilesButtonGroup';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  libro: Book;
}

const BookCard: React.FC<BookCardProps> = ({ libro }) => {
  const navigate = useNavigate();

  const handleVerDetalles = (libroId: string) => {
    navigate(`/libro/${libroId}`);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-2">{libro.titulo}</h3>
      <p className="text-gray-600 mb-2">Autor: {libro.autor}</p>
      <p className="text-sm text-gray-500">Categoría: {libro.categoria}</p>
      <div className="mt-2 flex flex-col gap-2">
        {/* Mostrar los botones de archivos digitales solo para usuarios autenticados */}
        <DigitalFilesButtonGroup bookId={libro.id} />
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">Disponibles: {libro.disponibles}</span>
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
