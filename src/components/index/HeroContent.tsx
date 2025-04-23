
import React from 'react';
import { User, UserRole } from '@/types';
import { LoggedInActions, GuestActions } from './HeroActions';

interface HeroContentProps {
  user: User | null;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const HeroContent = ({ user, hasRole }: HeroContentProps) => {
  return (
    <div className="md:w-1/2 mb-8 md:mb-0">
      <h1 className="text-4xl font-bold mb-4">Sistema de Gestión Bibliotecaria</h1>
      <p className="text-xl mb-6">
        Bienvenido al sistema de gestión de libros de la Biblioteca de la Universidad Tecnológica de la Mixteca.
      </p>
      {user ? <LoggedInActions user={user} hasRole={hasRole} /> : <GuestActions />}
    </div>
  );
};

export default HeroContent;
