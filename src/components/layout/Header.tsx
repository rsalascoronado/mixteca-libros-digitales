
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import HeaderLeft from './HeaderLeft';
import HeaderRight from './HeaderRight';

const Header = () => {
  const { user, logout, hasRole } = useAuth();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.email.endsWith('@gs.utm.mx')) {
      return `${user.nombre} ${user.apellidos}`;
    }
    return user.nombre;
  };

  return (
    <header className="bg-[#56070c] text-white py-2 px-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <HeaderLeft />
        <HeaderRight
          user={user}
          logout={logout}
          hasRole={hasRole}
          isMobile={isMobile}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          getUserDisplayName={getUserDisplayName}
        />
      </div>
    </header>
  );
};

export default Header;
