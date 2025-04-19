import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User, BookOpen, Users, Home, Menu } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { user, logout, hasRole } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // Check for admin/librarian access AND ensure user is not from gs.utm.mx domain
  const isStaff = hasRole(['bibliotecario', 'administrador']) && user?.email && !user.email.endsWith('@gs.utm.mx');
  
  // Get display name based on domain
  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.email.endsWith('@gs.utm.mx')) {
      return `${user.nombre} ${user.apellidos}`;
    }
    return user.nombre;
  };

  return <header className="bg-primary text-primary-foreground py-2 px-4 shadow-md">
    <div className="container mx-auto flex items-center justify-between">
      {/* Logo and home section */}
      <div className="flex items-center space-x-2">
        {/* Home Button - Always visible for all roles, responsive */}
        <Link to="/" className="flex items-center">
          <Button 
            variant="ghost" 
            size={isMobile ? "icon" : "default"}
            className="text-primary-foreground hover:bg-primary/20 hover:text-white flex items-center"
          >
            <Home className="h-5 w-5 mr-2" />
            {!isMobile && "Inicio"}
            <span className="sr-only">Inicio</span>
          </Button>
        </Link>

        <Link to="/" className="flex items-center">
          {/* Logo UTM */}
          <img alt="Universidad Tecnológica de la Mixteca" className="h-12 mr-3" src="/lovable-uploads/da5d1cb5-c9ee-4a74-8eee-4ca375d69604.jpg" />
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">Biblioteca</span>
            <span className="text-xs tracking-tight">Universidad Tecnológica de la Mixteca</span>
          </div>
        </Link>
      </div>

      {/* Mobile menu button */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-primary-foreground hover:bg-primary/20 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menú</span>
        </Button>
      )}

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center space-x-4">
        <Link to="/" className="text-primary-foreground hover:text-white transition-colors">Inicio</Link>
        <Link to="/catalogo" className="text-primary-foreground hover:text-white transition-colors">Catálogo</Link>
        <Link to="/ayuda" className="text-primary-foreground hover:text-white transition-colors">Ayuda</Link>
        {user && <Link to="/mis-prestamos" className="text-primary-foreground hover:text-white transition-colors">
            Mis préstamos
          </Link>}
      </nav>

      {/* Admin dropdown - only shown for staff roles and non-student emails */}
      {isStaff && !isMobile && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/20 hover:text-white ml-2">
              Administración
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/admin/prestamos">Gestionar préstamos</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/libros">Gestionar libros</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/tesis">Gestionar tesis</Link>
            </DropdownMenuItem>
            {hasRole('administrador') && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin/usuarios">Gestionar usuarios</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin/configuracion">Configuración</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {/* User account section */}
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
              {/* Mobile admin menu - only shown for staff roles and non-student emails */}
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
    </div>

    {/* Mobile menu */}
    {isMobile && mobileMenuOpen && (
      <div className="md:hidden bg-primary border-t border-primary-foreground/20 mt-2 py-2">
        <nav className="flex flex-col space-y-2 px-4">
          <Link 
            to="/catalogo" 
            className="text-primary-foreground hover:text-white transition-colors py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Catálogo
          </Link>
          <Link 
            to="/ayuda" 
            className="text-primary-foreground hover:text-white transition-colors py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Ayuda
          </Link>
          {user && (
            <Link 
              to="/mis-prestamos" 
              className="text-primary-foreground hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mis préstamos
            </Link>
          )}
        </nav>
      </div>
    )}
  </header>;
};

export default Header;
