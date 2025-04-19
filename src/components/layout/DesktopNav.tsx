
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Library, FileText, BookOpen, GraduationCap, Calendar } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User } from '@/types';
import { canManageBooks, canManageTheses, canManageDigitalBooks, isLibrarian } from '@/lib/user-utils';

interface DesktopNavProps {
  user: User | null;
  isLibrarian: boolean;
}

export const DesktopNav = ({ user, isLibrarian }: DesktopNavProps) => {
  return (
    <nav className="hidden md:flex items-center space-x-4">
      <Link to="/" className="text-primary-foreground hover:text-white transition-colors">Inicio</Link>
      <Link to="/catalogo" className="text-primary-foreground hover:text-white transition-colors">Catálogo</Link>
      <Link to="/ayuda" className="text-primary-foreground hover:text-white transition-colors">Ayuda</Link>
      {user && (
        <Link to="/mis-prestamos" className="text-primary-foreground hover:text-white transition-colors">
          Mis préstamos
        </Link>
      )}
      {user && (isLibrarian || canManageBooks(user) || canManageTheses(user) || canManageDigitalBooks(user)) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/20 hover:text-white">
              <Library className="h-4 w-4 mr-2" />
              Gestionar recursos
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white z-50">
            {isLibrarian && (
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin/prestamos" 
                  className="flex w-full items-center gap-2"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Gestionar préstamos
                </Link>
              </DropdownMenuItem>
            )}
            {canManageBooks(user) && (
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin/libros" 
                  className="flex w-full items-center gap-2"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Gestionar libros
                </Link>
              </DropdownMenuItem>
            )}
            {canManageTheses(user) && (
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin/tesis" 
                  className="flex w-full items-center gap-2"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Gestionar tesis
                </Link>
              </DropdownMenuItem>
            )}
            {canManageDigitalBooks(user) && (
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin/ebooks" 
                  className="flex w-full items-center gap-2"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Gestionar libros digitales
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};
