
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
    console.log("Fetching theses from database...");
    
    const { data, error } = await supabase
      .from('theses')
      .select('*');
    
    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No theses found in database, using mock data');
      return [...mockTheses];
    }
    
    console.log(`Retrieved ${data.length} theses from database`);
    
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
  } catch (error) {
    console.error('Error fetching theses:', error);
    // Fallback to mock data if there's an error
    console.log('Falling back to mock theses data');
    return [...mockTheses];
  }
}

export async function saveThesis(thesis: Thesis): Promise<Thesis> {
  try {
    console.log("Saving thesis to database:", thesis);

    // Convertir el objeto Thesis al formato de la tabla en la DB
    const thesisData = {
      titulo: thesis.titulo,
      autor: thesis.autor,
      carrera: thesis.carrera,
      anio: thesis.anio,
      director: thesis.director,
      tipo: thesis.tipo,
      disponible: thesis.disponible,
      resumen: thesis.resumen,
      archivo_pdf: thesis.archivoPdf,
      updated_at: new Date().toISOString()
    };

    let result;
    
    if (thesis.id && thesis.id.length > 0 && thesis.id !== 'new') {
      // Update existing thesis
      const { data, error } = await supabase
        .from('theses')
        .update(thesisData)
        .eq('id', thesis.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
      console.log("Thesis updated successfully:", result);
    } else {
      // Insert new thesis
      const { data, error } = await supabase
        .from('theses')
        .insert([thesisData])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
      console.log("Thesis created successfully:", result);
    }
    
    // Convertir el resultado de vuelta al formato Thesis
    return {
      id: result.id,
      titulo: result.titulo,
      autor: result.autor,
      carrera: result.carrera,
      anio: result.anio,
      director: result.director,
      tipo: result.tipo as 'Licenciatura' | 'Maestría' | 'Doctorado',
      disponible: result.disponible,
      resumen: result.resumen,
      archivoPdf: result.archivo_pdf
    };
  } catch (error) {
    console.error('Error saving thesis:', error);
    throw error;
  }
}

export async function deleteThesis(id: string): Promise<void> {
  try {
    console.log("Deleting thesis with ID:", id);
    
    const { error } = await supabase
      .from('theses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    console.log("Thesis deleted successfully");
  } catch (error) {
    console.error('Error deleting thesis:', error);
    throw error;
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
    console.log("Fetching digital books from database...");
    
    const { data, error } = await supabase
      .from('digital_books')
      .select('*');
    
    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No digital books found in database, using mock data');
      return [...mockDigitalBooks];
    }
    
    console.log(`Retrieved ${data.length} digital books from database`);
    
    return data.map((digitalBook) => ({
      id: digitalBook.id || '',
      bookId: digitalBook.book_id || '',
      formato: (digitalBook.formato as 'PDF' | 'EPUB' | 'MOBI' | 'HTML') || 'PDF',
      url: digitalBook.url || '',
      tamanioMb: Number(digitalBook.tamanio_mb) || 0,
      fechaSubida: new Date(digitalBook.fecha_subida),
      resumen: digitalBook.resumen,
      storage_path: digitalBook.storage_path
    }));
  } catch (error) {
    console.error('Error fetching digital books:', error);
    // Fallback to mock data if there's an error
    console.log('Falling back to mock digital books data');
    return [...mockDigitalBooks];
  }
}

export async function saveDigitalBook(digitalBook: Partial<DigitalBook>): Promise<DigitalBook> {
  try {
    console.log("Saving digital book to database:", digitalBook);

    // Convertir el objeto DigitalBook al formato de la tabla en la DB
    const digitalBookData = {
      book_id: digitalBook.bookId,
      formato: digitalBook.formato,
      url: digitalBook.url,
      tamanio_mb: digitalBook.tamanioMb,
      fecha_subida: digitalBook.fechaSubida ? digitalBook.fechaSubida.toISOString() : new Date().toISOString(),
      resumen: digitalBook.resumen,
      storage_path: digitalBook.storage_path
    };

    let result;
    
    if (digitalBook.id) {
      // Update existing digital book
      const { data, error } = await supabase
        .from('digital_books')
        .update(digitalBookData)
        .eq('id', digitalBook.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
      console.log("Digital book updated successfully:", result);
    } else {
      // Insert new digital book
      const { data, error } = await supabase
        .from('digital_books')
        .insert([digitalBookData])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
      console.log("Digital book created successfully:", result);
    }
    
    // Convertir el resultado de vuelta al formato DigitalBook
    return {
      id: result.id,
      bookId: result.book_id,
      formato: result.formato as 'PDF' | 'EPUB' | 'MOBI' | 'HTML',
      url: result.url,
      tamanioMb: Number(result.tamanio_mb),
      fechaSubida: new Date(result.fecha_subida),
      resumen: result.resumen,
      storage_path: result.storage_path
    };
  } catch (error) {
    console.error('Error saving digital book:', error);
    throw error;
  }
}

export async function deleteDigitalBook(id: string): Promise<void> {
  try {
    console.log("Deleting digital book with ID:", id);
    
    const { error } = await supabase
      .from('digital_books')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    console.log("Digital book deleted successfully");
  } catch (error) {
    console.error('Error deleting digital book:', error);
    throw error;
  }
}
