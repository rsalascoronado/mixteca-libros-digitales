
import { UserRole } from '@/types/user';

export type AccessLevel = 'permitir' | 'restringir' | 'ocultar';

export interface ModulePermission {
  id: string;
  name: string;
  description: string;
  defaultAccess: Record<UserRole, AccessLevel>;
}

export interface RolePermissionsState {
  [roleId: string]: {
    [moduleId: string]: AccessLevel;
  };
}

export const defaultModules: ModulePermission[] = [
  {
    id: 'libros',
    name: 'Gestión de Libros',
    description: 'Administración de libros físicos en la biblioteca',
    defaultAccess: {
      estudiante: 'restringir',
      profesor: 'permitir',
      tecnico: 'permitir',
      administrativo: 'permitir',
      operativo: 'restringir',
      bibliotecario: 'permitir',
      administrador: 'permitir',
    }
  },
  {
    id: 'ebooks',
    name: 'Libros Digitales',
    description: 'Gestión de libros electrónicos y recursos digitales',
    defaultAccess: {
      estudiante: 'permitir',
      profesor: 'permitir',
      tecnico: 'permitir',
      administrativo: 'permitir',
      operativo: 'restringir',
      bibliotecario: 'permitir',
      administrador: 'permitir',
    }
  },
  {
    id: 'prestamos',
    name: 'Préstamos',
    description: 'Administración de préstamos y devoluciones',
    defaultAccess: {
      estudiante: 'restringir',
      profesor: 'restringir',
      tecnico: 'restringir',
      administrativo: 'restringir',
      operativo: 'restringir',
      bibliotecario: 'permitir',
      administrador: 'permitir',
    }
  },
  {
    id: 'usuarios',
    name: 'Gestión de Usuarios',
    description: 'Administración de cuentas de usuario',
    defaultAccess: {
      estudiante: 'ocultar',
      profesor: 'ocultar',
      tecnico: 'ocultar',
      administrativo: 'ocultar',
      operativo: 'ocultar',
      bibliotecario: 'restringir',
      administrador: 'permitir',
    }
  },
  {
    id: 'tesis',
    name: 'Tesis',
    description: 'Administración de tesis académicas',
    defaultAccess: {
      estudiante: 'restringir',
      profesor: 'permitir',
      tecnico: 'restringir',
      administrativo: 'restringir',
      operativo: 'restringir',
      bibliotecario: 'permitir',
      administrador: 'permitir',
    }
  },
  {
    id: 'configuracion',
    name: 'Configuración',
    description: 'Configuración general del sistema',
    defaultAccess: {
      estudiante: 'ocultar',
      profesor: 'ocultar',
      tecnico: 'ocultar',
      administrativo: 'ocultar',
      operativo: 'ocultar',
      bibliotecario: 'ocultar',
      administrador: 'permitir',
    }
  }
];

export const roles: UserRole[] = [
  'estudiante', 
  'profesor', 
  'tecnico', 
  'administrativo', 
  'operativo', 
  'bibliotecario', 
  'administrador'
];
