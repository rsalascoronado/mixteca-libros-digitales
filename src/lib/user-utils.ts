
import { User } from '@/types';

export const isLibrarian = (user: User | null): boolean => {
  return user?.email === 'biblioteca@mixteco.utm.mx' || 
         user?.email === 'admin@mixteco.utm.mx' ||
         user?.email === 'adminadmin@mixteco.utm.mx' ||
         user?.role === 'bibliotecario' ||
         user?.role === 'administrador';
};
