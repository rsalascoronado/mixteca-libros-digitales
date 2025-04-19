
import { User } from '@/types';

export const isLibrarian = (user: User | null): boolean => {
  return user?.email === 'biblioteca@mixteco.utm.mx' || 
         user?.role === 'bibliotecario';
};
