
import React from 'react';
import { HeaderLogo } from './HeaderLogo';
import { DesktopNav } from './DesktopNav';
import { useAuth } from '@/contexts/AuthContext';

const HeaderLeft = () => {
  const { user } = useAuth();
  return (
    <div className="flex items-center space-x-4">
      <HeaderLogo />
      <DesktopNav user={user} />
    </div>
  );
};

export default HeaderLeft;

