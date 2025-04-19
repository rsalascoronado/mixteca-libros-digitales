
import { supabase } from '@/integrations/supabase/client';
import type { Book, BookCategory, Thesis, Prestamo } from '@/types';
import type { DigitalBook } from '@/types/digitalBook';
import { mockBooks, mockCategories } from '@/types/book';
import { mockTheses } from '@/types/thesis';
import { mockPrestamos } from '@/types/prestamo';
import { mockDigitalBooks } from '@/types/digitalBook';

// Use mock data until Supabase tables are properly set up
export async function fetchBooks(): Promise<Book[]> {
  try {
    console.log("Fetching books...");
    // For now, return mock data
    // Later, when the database is set up, uncomment and use the supabase query
    /*
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        book_categories(nombre)
      `);
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    return data.map((book) => ({
      id: book.id || '',
      titulo: book.titulo || '',
      autor: book.autor || '',
      isbn: book.isbn || '',
      categoria: book.book_categories?.nombre || 'Sin categoría',
      editorial: book.editorial || '',
      anioPublicacion: book.anio_publicacion || 0,
      copias: book.copias || 0,
      disponibles: book.disponibles || 0,
      imagen: book.imagen,
      ubicacion: book.ubicacion || '',
      descripcion: book.descripcion
    }));
    */
    
    // Return mock data
    return Promise.resolve([...mockBooks]);
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

export async function fetchCategories(): Promise<BookCategory[]> {
  try {
    console.log("Fetching categories...");
    // For now, return mock data
    // Later, when the database is set up, uncomment and use the supabase query
    /*
    const { data, error } = await supabase
      .from('book_categories')
      .select('*');
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    return data.map((category) => ({
      id: category.id || '',
      nombre: category.nombre || '',
      descripcion: category.descripcion
    }));
    */
    
    // Return mock data
    return Promise.resolve([...mockCategories]);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchTheses(): Promise<Thesis[]> {
  try {
    console.log("Fetching theses...");
    // For now, return mock data
    // Later, when the database is set up, uncomment and use the supabase query
    /*
    const { data, error } = await supabase
      .from('theses')
      .select('*');
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    return data.map((thesis) => ({
      id: thesis.id || '',
      titulo: thesis.titulo || '',
      autor: thesis.autor || '',
      carrera: thesis.carrera || '',
      anio: thesis.anio || 0,
      director: thesis.director || '',
      tipo: (thesis.tipo as 'Licenciatura' | 'Maestría' | 'Doctorado') || 'Licenciatura',
      disponible: thesis.disponible !== false,
      resumen: thesis.resumen,
      archivoPdf: thesis.archivo_pdf
    }));
    */
    
    // Return mock data
    return Promise.resolve([...mockTheses]);
  } catch (error) {
    console.error('Error fetching theses:', error);
    return [];
  }
}

export async function fetchLoans(): Promise<Prestamo[]> {
  try {
    console.log("Fetching loans...");
    // For now, return mock data
    // Later, when the database is set up, uncomment and use the supabase query
    /*
    const { data, error } = await supabase
      .from('loans')
      .select(`
        *,
        books (titulo),
        auth.users!inner (email)
      `);
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    return data.map((loan) => ({
      id: loan.id || '',
      userId: loan.user_id || '',
      bookId: loan.book_id || '',
      fechaPrestamo: new Date(loan.fecha_prestamo),
      fechaDevolucion: new Date(loan.fecha_devolucion),
      estado: (loan.estado as 'prestado' | 'devuelto' | 'retrasado') || 'prestado',
      observaciones: loan.observaciones
    }));
    */
    
    // Return mock data
    return Promise.resolve([...mockPrestamos]);
  } catch (error) {
    console.error('Error fetching loans:', error);
    return [];
  }
}

export async function fetchDigitalBooks(): Promise<DigitalBook[]> {
  try {
    console.log("Fetching digital books...");
    // For now, return mock data
    // Later, when the database is set up, uncomment and use the supabase query
    /*
    const { data, error } = await supabase
      .from('digital_books')
      .select(`
        *,
        books!inner (titulo)
      `);
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    return data.map((digitalBook) => ({
      id: digitalBook.id || '',
      bookId: digitalBook.book_id || '',
      formato: (digitalBook.formato as 'PDF' | 'EPUB' | 'MOBI' | 'HTML') || 'PDF',
      url: digitalBook.url || '',
      tamanioMb: Number(digitalBook.tamanio_mb) || 0,
      fechaSubida: new Date(digitalBook.fecha_subida),
      resumen: digitalBook.resumen
    }));
    */
    
    // Return mock data
    return Promise.resolve([...mockDigitalBooks]);
  } catch (error) {
    console.error('Error fetching digital books:', error);
    return [];
  }
}
