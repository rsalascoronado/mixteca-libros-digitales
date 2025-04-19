
export const isLibrarian = (user: User | null): boolean => {
  return user?.email === 'biblioteca@mixteco.utm.mx' || 
         user?.email === 'admin@mixteco.utm.mx' || // Kept this line
         user?.role === 'bibliotecario' ||
         user?.role === 'administrador';
};
