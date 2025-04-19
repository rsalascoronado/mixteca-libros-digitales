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
}

export const DesktopNav = ({ user }: DesktopNavProps) => {
  // Check permissions directly using the user object
  const userIsLibrarian = user ? isLibrarian(user) : false;
  const userCanManageBooks = user ? canManageBooks(user) : false;
  const userCanManageTheses = user ? canManageTheses(user) : false;
  const userCanManageDigitalBooks = user ? canManageDigitalBooks(user) : false;
  
  // Only show admin menu if user has at least one management permission
  const showAdminMenu = userIsLibrarian || userCanManageBooks || userCanManageTheses || userCanManageDigitalBooks;
  
  return (
    <nav className="hidden md:flex items-center space-x-4">
      <Link to="/" className="text-primary-foreground hover:text-white transition-colors text-sm lg:text-base">
        Inicio
      </Link>
      <Link to="/catalogo" className="text-primary-foreground hover:text-white transition-colors text-sm lg:text-base">
        Catálogo
      </Link>
      <Link to="/ayuda" className="text-primary-foreground hover:text-white transition-colors text-sm lg:text-base">
        Ayuda
      </Link>
      {user && (
        <Link to="/mis-prestamos" className="text-primary-foreground hover:text-white transition-colors text-sm lg:text-base">
          Mis préstamos
        </Link>
      )}
      {user && showAdminMenu && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-foreground hover:bg-primary/20 hover:text-white text-sm lg:text-base transition-all duration-200 ease-in-out"
            >
              <Library className="h-4 w-4 mr-2" />
              Gestionar recursos
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="bg-white z-50 w-56 lg:w-64 p-2"
            align="end"
            sideOffset={5}
          >
            {userIsLibrarian && (
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin/prestamos" 
                  className="flex w-full items-center gap-2 text-sm lg:text-base p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  Gestionar préstamos
                </Link>
              </DropdownMenuItem>
            )}
            {userCanManageBooks && (
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin/libros" 
                  className="flex w-full items-center gap-2 text-sm lg:text-base p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Gestionar libros
                </Link>
              </DropdownMenuItem>
            )}
            {userCanManageTheses && (
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin/tesis" 
                  className="flex w-full items-center gap-2 text-sm lg:text-base p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <GraduationCap className="h-4 w-4" />
                  Gestionar tesis
                </Link>
              </DropdownMenuItem>
            )}
            {userCanManageDigitalBooks && (
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin/ebooks" 
                  className="flex w-full items-center gap-2 text-sm lg:text-base p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <FileText className="h-4 w-4" />
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
