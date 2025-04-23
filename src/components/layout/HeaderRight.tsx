
import React from 'react';
import { MobileMenu } from './MobileMenu';
import { UserMenu } from './UserMenu';
import { User, UserRole } from '@/types';

interface HeaderRightProps {
  user: User | null;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  isMobile: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  getUserDisplayName: () => string;
}

const HeaderRight = ({
  user,
  logout,
  hasRole,
  isMobile,
  mobileMenuOpen,
  setMobileMenuOpen,
  getUserDisplayName,
}: HeaderRightProps) => {
  return (
    <div className="flex items-center gap-2">
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
        hasRole={hasRole}
      />
    </div>
  );
};

export default HeaderRight;

