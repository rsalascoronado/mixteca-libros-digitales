
import { User, UserRole } from '@/types';

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
  // Allow librarians and administrators to manage digital books
  return isLibrarian(user);
};

export const canManageBooks = (user: User | null): boolean => {
  if (!user) return false;
  // Allow librarians and administrators to manage physical books
  return isLibrarian(user);
};

export const canManageTheses = (user: User | null): boolean => {
  if (!user) return false;
  // Allow librarians and administrators to manage theses
  return isLibrarian(user);
};

export const canManageUsers = (user: User | null): boolean => {
  if (!user) return false;
  // Solo administradores y bibliotecarios pueden gestionar usuarios
  return user.role === 'administrador' || user.role === 'bibliotecario';
};
