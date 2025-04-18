export type UserRole = 'estudiante' | 'profesor' | 'tecnico' | 'administrativo' | 'operativo' | 'bibliotecario' | 'administrador';

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface Book {
  id: string;
  titulo: string;
  autor: string;
  isbn: string;
  categoria: string;
  editorial: string;
  anioPublicacion: number;
  copias: number;
  disponibles: number;
  imagen?: string;
  ubicacion: string;
  descripcion?: string;
}

export interface BookCategory {
  id: string;
  nombre: string;
  descripcion?: string;
}

export const mockCategories: BookCategory[] = [
  {
    id: '1',
    nombre: 'Matemáticas',
    descripcion: 'Libros de matemáticas, cálculo, álgebra y geometría'
  },
  {
    id: '2',
    nombre: 'Física',
    descripcion: 'Libros de física, mecánica y termodinámica'
  },
  {
    id: '3',
    nombre: 'Informática',
    descripcion: 'Libros de programación, redes y sistemas'
  },
  {
    id: '4',
    nombre: 'Química',
    descripcion: 'Libros de química general y orgánica'
  }
];

export interface PrestamoConfig {
  role: UserRole;
  diasPrestamo: number;
  maxLibros: number;
}

export interface Prestamo {
  id: string;
  userId: string;
  bookId: string;
  fechaPrestamo: Date;
  fechaDevolucion: Date;
  estado: 'prestado' | 'devuelto' | 'retrasado';
  observaciones?: string;
  penalizacion?: {
    dias: number;
    razon: string;
    fechaAplicacion: Date;
  };
}

export interface Thesis {
  id: string;
  titulo: string;
  autor: string;
  carrera: string;
  anio: number;
  director: string;
  tipo: 'Licenciatura' | 'Maestría' | 'Doctorado';
  disponible: boolean;
  resumen?: string;
  archivoPdf?: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@mixteco.utm.mx',
    nombre: 'Admin',
    apellidos: 'Sistema',
    role: 'administrador',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    email: 'biblioteca@mixteco.utm.mx',
    nombre: 'Bibliotecario',
    apellidos: 'Principal',
    role: 'bibliotecario',
    createdAt: new Date('2023-01-02'),
  },
  {
    id: '3',
    email: 'profesor@mixteco.utm.mx',
    nombre: 'Juan',
    apellidos: 'Pérez López',
    role: 'profesor',
    createdAt: new Date('2023-01-03'),
  },
  {
    id: '4',
    email: 'alumno@mixteco.utm.mx',
    nombre: 'María',
    apellidos: 'García Sánchez',
    role: 'estudiante',
    createdAt: new Date('2023-01-04'),
  },
  {
    id: '5',
    email: 'tecnico@mixteco.utm.mx',
    nombre: 'Roberto',
    apellidos: 'Ramírez Torres',
    role: 'tecnico',
    createdAt: new Date('2023-01-05'),
  },
  {
    id: '6',
    email: 'admin@mixteco.utm.mx',
    nombre: 'Carmen',
    apellidos: 'Rodríguez Jiménez',
    role: 'administrativo',
    createdAt: new Date('2023-01-06'),
  },
];

export const mockBooks: Book[] = [
  {
    id: '1',
    titulo: 'Cálculo de una variable',
    autor: 'James Stewart',
    isbn: '9786075228280',
    categoria: 'Matemáticas',
    editorial: 'Cengage Learning',
    anioPublicacion: 2018,
    copias: 5,
    disponibles: 3,
    ubicacion: 'Estante A-1',
    descripcion: 'Texto clásico para el estudio del cálculo diferencial e integral.',
  },
  {
    id: '2',
    titulo: 'Física para ciencias e ingeniería',
    autor: 'Raymond A. Serway',
    isbn: '9786075228426',
    categoria: 'Física',
    editorial: 'Cengage Learning',
    anioPublicacion: 2019,
    copias: 4,
    disponibles: 2,
    ubicacion: 'Estante B-3',
    descripcion: 'Libro completo sobre física para estudiantes de ingeniería.',
  },
  {
    id: '3',
    titulo: 'Introducción a la Programación con Python',
    autor: 'Arnaldo Pérez Castaño',
    isbn: '9781683922193',
    categoria: 'Informática',
    editorial: 'Alfa Omega',
    anioPublicacion: 2020,
    copias: 8,
    disponibles: 5,
    ubicacion: 'Estante C-2',
    descripcion: 'Guía práctica para aprender a programar en Python desde cero.',
  },
  {
    id: '4',
    titulo: 'Química General',
    autor: 'Petrucci, Herring, Madura',
    isbn: '9788490355336',
    categoria: 'Química',
    editorial: 'Pearson',
    anioPublicacion: 2017,
    copias: 3,
    disponibles: 1,
    ubicacion: 'Estante B-1',
    descripcion: 'Principios esenciales de la química moderna explicados con claridad.',
  },
  {
    id: '5',
    titulo: 'Base de Datos',
    autor: 'Abraham Silberschatz',
    isbn: '9781260084504',
    categoria: 'Informática',
    editorial: 'McGraw-Hill',
    anioPublicacion: 2019,
    copias: 6,
    disponibles: 4,
    ubicacion: 'Estante C-3',
    descripcion: 'Fundamentos de diseño e implementación de bases de datos.',
  },
  {
    id: '6',
    titulo: 'Álgebra Lineal y sus Aplicaciones',
    autor: 'David C. Lay',
    isbn: '9786073221412',
    categoria: 'Matemáticas',
    editorial: 'Pearson',
    anioPublicacion: 2016,
    copias: 7,
    disponibles: 3,
    ubicacion: 'Estante A-2',
    descripcion: 'Estudio completo de algebra lineal con aplicaciones prácticas.',
  },
];

export const mockPrestamos: Prestamo[] = [
  {
    id: '1',
    userId: '4',
    bookId: '1',
    fechaPrestamo: new Date('2023-05-10'),
    fechaDevolucion: new Date('2023-05-24'),
    estado: 'prestado',
  },
  {
    id: '2',
    userId: '3',
    bookId: '2',
    fechaPrestamo: new Date('2023-05-05'),
    fechaDevolucion: new Date('2023-06-05'),
    estado: 'prestado',
  },
  {
    id: '3',
    userId: '5',
    bookId: '3',
    fechaPrestamo: new Date('2023-04-20'),
    fechaDevolucion: new Date('2023-05-04'),
    estado: 'retrasado',
    penalizacion: {
      dias: 15,
      razon: 'Devolución con retraso significativo',
      fechaAplicacion: new Date('2023-05-04'),
    },
  },
  {
    id: '4',
    userId: '4',
    bookId: '6',
    fechaPrestamo: new Date('2023-04-15'),
    fechaDevolucion: new Date('2023-04-29'),
    estado: 'devuelto',
  },
];

export const mockTheses: Thesis[] = [
  {
    id: "1",
    titulo: "Desarrollo de un Sistema de Reconocimiento de Patrones para Análisis de Imágenes Médicas",
    autor: "Juan Pérez Martínez",
    carrera: "Ingeniería en Computación",
    anio: 2023,
    director: "Dr. María Rodríguez López",
    tipo: "Maestría",
    disponible: true,
    resumen: "Investigación sobre la implementación de algoritmos de deep learning para la detección temprana de patologías en imágenes médicas.",
    archivoPdf: "/tesis/ejemplo1.pdf"
  },
  {
    id: "2",
    titulo: "Optimización de Procesos Industriales mediante Algoritmos Genéticos",
    autor: "Ana García Ramírez",
    carrera: "Ingeniería Industrial",
    anio: 2022,
    director: "Dr. Carlos Sánchez Díaz",
    tipo: "Doctorado",
    disponible: true,
    resumen: "Estudio sobre la aplicación de algoritmos genéticos en la optimización de procesos de manufactura."
  },
  {
    id: "3",
    titulo: "Diseño e Implementación de un Sistema de Energía Solar para Comunidades Rurales",
    autor: "Luis Torres Hernández",
    carrera: "Ingeniería en Electrónica",
    anio: 2023,
    director: "Dra. Patricia López Mendoza",
    tipo: "Licenciatura",
    disponible: true,
    resumen: "Proyecto de implementación de sistemas fotovoltaicos en comunidades rurales de la Mixteca."
  }
];

export const defaultPrestamoConfig: PrestamoConfig[] = [
  { role: 'estudiante', diasPrestamo: 14, maxLibros: 3 },
  { role: 'profesor', diasPrestamo: 30, maxLibros: 5 },
  { role: 'tecnico', diasPrestamo: 21, maxLibros: 3 },
  { role: 'administrativo', diasPrestamo: 14, maxLibros: 2 },
  { role: 'operativo', diasPrestamo: 7, maxLibros: 1 },
  { role: 'bibliotecario', diasPrestamo: 30, maxLibros: 5 },
  { role: 'administrador', diasPrestamo: 30, maxLibros: 5 },
];
