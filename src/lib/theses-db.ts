
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
      throw new Error(`Error al obtener las tesis: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.log('No se encontraron tesis en la base de datos, usando datos de ejemplo');
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
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.warn(`Usando datos de ejemplo debido a error: ${errorMessage}`);
    return [...mockTheses];
  }
}

// Función auxiliar para validar UUID
function isValidUUID(id: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
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

    // Para la inserción, solo incluir created_at, para update no modificar created_at.
    if (thesis.id && thesis.id.length > 0 && thesis.id !== 'new') {
      // Si es un ID de los datos de ejemplo (no un UUID válido), tratar como nueva tesis
      if (!isValidUUID(thesis.id)) {
        console.log(`ID no es un UUID válido: ${thesis.id}, tratando como nueva tesis`);
        
        // Crear una nueva tesis en lugar de actualizar
        const dataToInsert = {
          ...thesisData,
          created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('theses')
          .insert([dataToInsert])
          .select()
          .single();
          
        if (error) {
          console.error('Error inserting thesis:', error);
          throw new Error(`Error creando tesis: ${error.message}`);
        }
        
        if (!data) {
          throw new Error('No se pudo crear la tesis, respuesta vacía del servidor');
        }
        
        result = data;
      } else {
        // Actualizar tesis existente con ID válido
        const { data, error } = await supabase
          .from('theses')
          .update(thesisData)
          .eq('id', thesis.id)
          .select()
          .single();
          
        if (error) {
          console.error('Error updating thesis:', error);
          throw new Error(`Error actualizando tesis: ${error.message}`);
        }
        
        if (!data) {
          throw new Error(`No se encontró la tesis con ID: ${thesis.id}`);
        }
        
        result = data;
      }
    } else {
      // Insert
      const dataToInsert = {
        ...thesisData,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('theses')
        .insert([dataToInsert])
        .select()
        .single();
        
      if (error) {
        console.error('Error inserting thesis:', error);
        throw new Error(`Error creando tesis: ${error.message}`);
      }
      
      if (!data) {
        throw new Error('No se pudo crear la tesis, respuesta vacía del servidor');
      }
      
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
    // Aclarar el error para el usuario
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Error al guardar la tesis: ${message}`);
  }
}

export async function deleteThesis(id: string): Promise<void> {
  try {
    // Si es un ID de los datos de ejemplo, simplemente retornar sin error
    if (!isValidUUID(id)) {
      console.log(`Intentando eliminar tesis con ID no válido: ${id}, operación simulada`);
      return;
    }
    
    const { error } = await supabase
      .from('theses')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting thesis:', error);
      throw new Error(`Error eliminando tesis: ${error.message}`);
    }
  } catch (error) {
    console.error('Error deleting thesis:', error);
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Error al eliminar la tesis: ${message}`);
  }
}
