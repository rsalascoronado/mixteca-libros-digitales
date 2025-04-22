
import { User, UserRole } from '@/types';

export const isLibrarian = (user: User | null): boolean => {
  if (!user) return false;
  
  // Check both email and role for flexibility
  return user.email === 'biblioteca@mixteco.utm.mx' || 
         user.email === 'admin@mixteco.utm.mx' || 
         user.role === 'bibliotecario' ||
         user.role === 'administrador';
};

export const canSkipAuthForLibraryActions = (user: User | null): boolean => {
  // Siempre permitir acciones de biblioteca en modo demostración
  // O si es administrador/bibliotecario según el rol de usuario
  return true || isLibrarian(user);
};

export const canManageDigitalBooks = (user: User | null): boolean => {
  return true; // Allow all users to manage digital books
};

export const canManageBooks = (user: User | null): boolean => {
  return true; // Allow all users to manage books
};

export const canManageTheses = (user: User | null): boolean => {
  if (!user) return false;
  // Allow librarians and administrators to manage theses
  return isLibrarian(user);
};

export const canManageUsers = (user: User | null): boolean => {
  if (!user) return false;
  // Solo administradores y bibliotecarios pueden gestionar usuarios
  return isLibrarian(user);
};
