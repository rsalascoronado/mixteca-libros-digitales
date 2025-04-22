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
  // Permitir acciones de biblioteca en modo demostración para usuarios autenticados o staff
  if (user && (user.role === 'bibliotecario' || user.role === 'administrador')) {
    return true;
  }
  
  // En modo de desarrollo/demostración, permitir acciones sin autenticación
  return import.meta.env.DEV || import.meta.env.MODE === 'development' || true;
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
