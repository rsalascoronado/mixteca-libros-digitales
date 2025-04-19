
import { supabase } from '@/integrations/supabase/client';
import type { Book, BookCategory, Thesis, Prestamo } from '@/types';
import type { DigitalBook } from '@/types/digitalBook';

export async function fetchBooks() {
  try {
    const { data, error } = await supabase
      .from('books')
      .select(`
        *,
        book_categories(nombre)
      `);
    
    if (error) throw error;
    
    // Make sure we return the correct structure even if data is empty or malformed
    if (!data || data.length === 0) return [];
    
    return data.map((book: any) => ({
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
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

export async function fetchCategories() {
  try {
    const { data, error } = await supabase
      .from('book_categories')
      .select('*');
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    return data.map((category: any) => ({
      id: category.id || '',
      nombre: category.nombre || '',
      descripcion: category.descripcion
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchTheses() {
  try {
    const { data, error } = await supabase
      .from('theses')
      .select('*');
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    return data.map((thesis: any) => ({
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
  } catch (error) {
    console.error('Error fetching theses:', error);
    return [];
  }
}

export async function fetchLoans() {
  try {
    const { data, error } = await supabase
      .from('loans')
      .select(`
        *,
        books (titulo),
        auth.users!inner (email)
      `);
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    return data.map((loan: any) => ({
      id: loan.id || '',
      userId: loan.user_id || '',
      bookId: loan.book_id || '',
      fechaPrestamo: new Date(loan.fecha_prestamo),
      fechaDevolucion: new Date(loan.fecha_devolucion),
      estado: (loan.estado as 'prestado' | 'devuelto' | 'retrasado') || 'prestado',
      observaciones: loan.observaciones
    }));
  } catch (error) {
    console.error('Error fetching loans:', error);
    return [];
  }
}

export async function fetchDigitalBooks() {
  try {
    const { data, error } = await supabase
      .from('digital_books')
      .select(`
        *,
        books!inner (titulo)
      `);
    
    if (error) throw error;
    
    if (!data || data.length === 0) return [];
    
    return data.map((digitalBook: any) => ({
      id: digitalBook.id || '',
      bookId: digitalBook.book_id || '',
      formato: (digitalBook.formato as 'PDF' | 'EPUB' | 'MOBI' | 'HTML') || 'PDF',
      url: digitalBook.url || '',
      tamanioMb: Number(digitalBook.tamanio_mb) || 0,
      fechaSubida: new Date(digitalBook.fecha_subida),
      resumen: digitalBook.resumen
    }));
  } catch (error) {
    console.error('Error fetching digital books:', error);
    return [];
  }
}
