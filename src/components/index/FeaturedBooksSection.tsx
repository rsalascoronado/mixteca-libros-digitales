
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookPlus } from 'lucide-react';
import { Libro } from '@/types';

interface FeaturedBooksSectionProps {
  librosDestacados: Libro[];
}
const FeaturedBooksSection = ({ librosDestacados }: FeaturedBooksSectionProps) => (
  <section className="py-16 bg-accent/50">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Libros destacados</h2>
        <Link to="/catalogo/consultados">
          <Button variant="link" className="text-primary">
            Ver catálogo completo
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {librosDestacados.map(libro => (
          <div key={libro.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-40 bg-gray-200 flex items-center justify-center">
              {libro.imagen
                ? <img src={libro.imagen} alt={libro.titulo} className="h-full w-full object-cover" />
                : <BookPlus className="h-16 w-16 text-gray-400" />}
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2 line-clamp-1">{libro.titulo}</h3>
              <p className="text-gray-600 mb-2">{libro.autor}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm bg-accent/80 px-2 py-1 rounded">
                  {libro.categoria}
                </span>
                <span className="text-sm text-gray-500">
                  {libro.disponibles} disponibles
                </span>
              </div>
              <Link to={`/libro/${libro.id}`}>
                <Button variant="outline" className="w-full">Ver detalles</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedBooksSection;
