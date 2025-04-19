import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, BookOpen, FileText } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User as UserType, UserRole } from '@/types';

interface UserMenuProps {
  user: UserType | null;
  logout: () => void;
  getUserDisplayName: () => string;
  isMobile: boolean;
  isStaff: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

export const UserMenu = ({ user, logout, getUserDisplayName, isMobile, isStaff, hasRole }: UserMenuProps) => {
  return (
    <div className="flex items-center">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white text-primary">
              <User className="h-4 w-4 mr-2" />
              {!isMobile && getUserDisplayName()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              <span>{getUserDisplayName()}</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mis-prestamos">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Mis préstamos</span>
              </Link>
            </DropdownMenuItem>
            {isMobile && isStaff && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Administración</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/admin/prestamos">Gestionar préstamos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/libros">Gestionar libros</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/tesis">Gestionar tesis</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/ebooks">
                    <FileText className="h-4 w-4 mr-2" />
                    Gestionar libros digitales
                  </Link>
                </DropdownMenuItem>
                {hasRole('administrador') && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/usuarios">Gestionar usuarios</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/configuracion">Configuración</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/login">
          <Button variant="outline" size="sm" className="bg-white text-primary">
            Iniciar sesión
          </Button>
        </Link>
      )}
    </div>
  );
};
