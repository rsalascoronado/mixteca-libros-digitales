
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface BooksCatalogFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoria: string;
  setCategoria: (category: string) => void;
  categorias: string[];
  disponibilidad: string;
  setDisponibilidad: (availability: string) => void;
  resetFilters: () => void;
}

const BooksCatalogFilters: React.FC<BooksCatalogFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  categoria,
  setCategoria,
  categorias,
  disponibilidad,
  setDisponibilidad,
  resetFilters,
}) => (
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="sm:col-span-2">
        <Label htmlFor="search">Buscar por título, autor o ISBN</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            id="search"
            type="text"
            placeholder="Buscar..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="categoria">Categoría</Label>
        <Select value={categoria} onValueChange={setCategoria}>
          <SelectTrigger id="categoria">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categorias.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="disponibilidad">Disponibilidad</Label>
        <Select value={disponibilidad} onValueChange={setDisponibilidad}>
          <SelectTrigger id="disponibilidad">
            <SelectValue placeholder="Cualquier disponibilidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Cualquier disponibilidad</SelectItem>
            <SelectItem value="disponible">Disponible físicamente</SelectItem>
            <SelectItem value="no-disponible">No disponible</SelectItem>
            <SelectItem value="digital">Disponible en digital</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div className="flex justify-end mt-4">
      <Button variant="outline" onClick={resetFilters} className="w-full sm:w-auto">
        Limpiar filtros
      </Button>
    </div>
  </div>
);

export default BooksCatalogFilters;
