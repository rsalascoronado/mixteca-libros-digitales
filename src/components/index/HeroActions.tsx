
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Users } from 'lucide-react';
import { User, UserRole } from '@/types';

interface HeroActionsProps {
  user: User | null;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

export const LoggedInActions = ({ user, hasRole }: HeroActionsProps) => {
  return (
    <div className="flex flex-wrap gap-4">
      <Link to="/catalogo">
        <Button size="lg" className="bg-white text-[#56070c] hover:bg-gray-100">
          <Search className="mr-2 h-5 w-5" />
          Buscar libros
        </Button>
      </Link>
      <Link to="/mis-prestamos">
        <Button size="lg" variant="outline" className="border-white hover:bg-primary-foreground/10 text-white">
          <BookOpen className="mr-2 h-5 w-5" />
          Mis préstamos
        </Button>
      </Link>
      {hasRole('administrador') && (
        <Link to="/admin/usuarios">
          <Button size="lg" variant="outline" className="border-white hover:bg-primary-foreground/10 text-white">
            <Users className="mr-2 h-5 w-5" />
            Gestionar usuarios
          </Button>
        </Link>
      )}
    </div>
  );
};

export const GuestActions = () => {
  return (
    <div className="flex flex-wrap gap-4">
      <Link to="/login">
        <Button size="lg" className="bg-white text-[#56070c] hover:bg-gray-100">
          Iniciar sesión
        </Button>
      </Link>
      <Link to="/catalogo">
        <Button size="lg" variant="outline" className="border-white hover:bg-primary-foreground/10 text-white">
          <Search className="mr-2 h-5 w-5" />
          Explorar catálogo
        </Button>
      </Link>
    </div>
  );
};
