
import { supabase } from '@/integrations/supabase/client';
import type { Book, BookCategory, Thesis, Prestamo, DigitalBook } from '@/types';

export async function fetchBooks() {
  const { data, error } = await supabase
    .from('books')
    .select(`
      *,
      book_categories(nombre)
    `);
  
  if (error) throw error;
  
  return data.map(book => ({
    ...book,
    categoria: book.book_categories?.nombre || 'Sin categoría'
  }));
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('book_categories')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function fetchTheses() {
  const { data, error } = await supabase
    .from('theses')
    .select('*');
  
  if (error) throw error;
  return data;
}

export async function fetchLoans() {
  const { data, error } = await supabase
    .from('loans')
    .select(`
      *,
      books (titulo),
      auth.users!inner (email)
    `);
  
  if (error) throw error;
  return data;
}

export async function fetchDigitalBooks() {
  const { data, error } = await supabase
    .from('digital_books')
    .select(`
      *,
      books!inner (titulo)
    `);
  
  if (error) throw error;
  return data;
}
