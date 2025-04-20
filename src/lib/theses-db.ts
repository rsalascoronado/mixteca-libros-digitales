
import { supabase } from '@/integrations/supabase/client';
import type { Thesis } from '@/types';
import { mockTheses } from '@/types/thesis';

// Fetch/CRUD Tesis
export async function fetchTheses(): Promise<Thesis[]> {
  try {
    const { data, error } = await supabase
      .from('theses')
      .select('*');
    
    if (error) {
      console.error('Error from Supabase:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return [...mockTheses];
    }
    
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
    return [...mockTheses];
  }
}

// Guardar tesis, aceptando tanto insert como update
export async function saveThesis(thesis: Thesis): Promise<Thesis> {
  try {
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
      const { data, error } = await supabase
        .from('theses')
        .update(thesisData)
        .eq('id', thesis.id)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('theses')
        .insert([thesisData])
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    }
    
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
    const { error } = await supabase
      .from('theses')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting thesis:', error);
    throw error;
  }
}
