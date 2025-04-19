
import { User } from '@/types';

export const isLibrarian = (user: User | null): boolean => {
  if (!user) return false;
  
  // Check both email and role for flexibility
  return user.email === 'biblioteca@mixteco.utm.mx' || 
         user.email === 'admin@mixteco.utm.mx' || 
         user.role === 'bibliotecario' ||
         user.role === 'administrador';
};

export const canManageDigitalBooks = (user: User | null): boolean => {
  if (!user) return false;
  return isLibrarian(user);
};

export const canManageBooks = (user: User | null): boolean => {
  if (!user) return false;
  return isLibrarian(user);
};

export const canManageTheses = (user: User | null): boolean => {
  if (!user) return false;
  return isLibrarian(user);
};
