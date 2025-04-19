
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { HeaderLogo } from './HeaderLogo';
import { DesktopNav } from './DesktopNav';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';

const Header = () => {
  const { user, logout, hasRole } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  
  // Specifically check for biblioteca@mixteco.utm.mx OR bibliotecario role
  const isLibrarian = user?.email === 'biblioteca@mixteco.utm.mx' || hasRole('bibliotecario');
  
  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.email.endsWith('@gs.utm.mx')) {
      return `${user.nombre} ${user.apellidos}`;
    }
    return user.nombre;
  };

  return (
    <header className="bg-primary text-primary-foreground py-2 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <HeaderLogo />
        
        <DesktopNav 
          user={user} 
          isLibrarian={isLibrarian}  // Pass the updated librarian check
        />

        <MobileMenu 
          isMobile={isMobile} 
          mobileMenuOpen={mobileMenuOpen} 
          setMobileMenuOpen={setMobileMenuOpen}
          user={user} 
        />

        <UserMenu 
          user={user}
          logout={logout}
          getUserDisplayName={getUserDisplayName}
          isMobile={isMobile}
          isStaff={hasRole(['bibliotecario', 'administrador'])}
          hasRole={hasRole}
        />
      </div>
    </header>
  );
};

export default Header;

