
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
  // Permitir acciones para usuarios con rol de bibliotecario o administrador
  if (user && (user.role === 'bibliotecario' || user.role === 'administrador')) {
    return true;
  }
  
  // En modo de desarrollo/demostración, permitir acciones sin autenticación
  // Al eliminar "|| true" aseguramos que solo los usuarios autenticados puedan realizar acciones
  return import.meta.env.DEV || import.meta.env.MODE === 'development';
};

export const canManageDigitalBooks = (user: User | null): boolean => {
  // Permitir a usuarios autenticados gestionar libros digitales
  return !!user;
};

export const canManageBooks = (user: User | null): boolean => {
  // Permitir a usuarios autenticados gestionar libros
  return !!user;
};

export const canManageTheses = (user: User | null): boolean => {
  if (!user) return false;
  // Permitir a bibliotecarios y administradores gestionar tesis
  return isLibrarian(user);
};

export const canManageUsers = (user: User | null): boolean => {
  if (!user) return false;
  // Solo administradores y bibliotecarios pueden gestionar usuarios
  return isLibrarian(user);
};
