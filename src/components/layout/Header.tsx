
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, BookOpen, Users } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Header = () => {
  const {
    user,
    logout,
    hasRole
  } = useAuth();
  return <header className="bg-primary text-primary-foreground py-2 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="flex items-center">
            {/* Logo UTM */}
            <img alt="Universidad Tecnológica de la Mixteca" className="h-12 mr-3" src="/lovable-uploads/da5d1cb5-c9ee-4a74-8eee-4ca375d69604.jpg" />
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight">Biblioteca</span>
              <span className="text-xs tracking-tight">Universidad Tecnológica de la Mixteca</span>
            </div>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-primary-foreground hover:text-white transition-colors">Inicio</Link>
          <Link to="/catalogo" className="text-primary-foreground hover:text-white transition-colors">Catálogo</Link>
          {user && <Link to="/mis-prestamos" className="text-primary-foreground hover:text-white transition-colors">
              Mis préstamos
            </Link>}
          {hasRole(['bibliotecario', 'administrador']) && <>
              <Link to="/admin/prestamos" className="text-primary-foreground hover:text-white transition-colors">
                Gestionar préstamos
              </Link>
              <Link to="/admin/libros" className="text-primary-foreground hover:text-white transition-colors">
                Gestionar libros
              </Link>
              <Link to="/admin/tesis" className="text-primary-foreground hover:text-white transition-colors">
                Gestionar tesis
              </Link>
              {hasRole('administrador') && <>
                <Link to="/admin/usuarios" className="text-primary-foreground hover:text-white transition-colors">
                  Gestionar usuarios
                </Link>
                <Link to="/admin/configuracion" className="text-primary-foreground hover:text-white transition-colors">
                  Configuración
                </Link>
              </>}
            </>}
        </nav>
        
        <div className="flex items-center">
          {user ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-white text-primary">
                  <User className="h-4 w-4 mr-2" />
                  {user.nombre}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>Mis préstamos</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <Link to="/login">
              <Button variant="outline" size="sm" className="bg-white text-primary">
                Iniciar sesión
              </Button>
            </Link>}
        </div>
      </div>
    </header>;
};

export default Header;
