
import { supabase } from '@/integrations/supabase/client';
import type { Thesis } from '@/types';
import { canSkipAuthForLibraryActions, isStaffUser } from '@/lib/user-utils';

// Auxiliary function to check UUID format
function isValidUUID(id: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
}

export async function saveThesis(thesis: Thesis): Promise<Thesis> {
  try {
    console.log("saveThesis iniciado con:", thesis);
    const { data: authData, error: authError } = await supabase.auth.getSession();

    if (authError) {
      console.error('Error checking authentication:', authError);
      throw new Error(`Error de autenticación: ${authError.message}`);
    }

    // Simplificar verificación de autenticación
    // En modo desarrollo o con sesión de usuario, permitir la operación
    const isDevelopmentMode = import.meta.env.DEV || import.meta.env.MODE === 'development';
    const hasActiveSession = !!authData.session;
    
    // Si no hay sesión y no estamos en modo desarrollo, rechazar la operación
    if (!hasActiveSession && !isDevelopmentMode) {
      console.error('No session found and not in development mode');
      throw new Error('Debes iniciar sesión para guardar tesis');
    }

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

    console.log("Datos preparados para guardar:", thesisData);
    let result;

    if (thesis.id && thesis.id.length > 0 && thesis.id !== 'new') {
      if (!isValidUUID(thesis.id)) {
        // Insert new thesis
        const dataToInsert = { ...thesisData, created_at: new Date().toISOString() };
        console.log("Insertando nueva tesis con datos:", dataToInsert);
        const { data, error } = await supabase
          .from('theses')
          .insert([dataToInsert])
          .select()
          .single();
        if (error) {
          console.error("Error insertando tesis:", error);
          throw new Error(`Error creando tesis: ${error.message}`);
        }
        if (!data) throw new Error('No se pudo crear la tesis, respuesta vacía del servidor');
        result = data;
      } else {
        // Update existing thesis
        console.log("Actualizando tesis existente con ID:", thesis.id);
        const { data, error } = await supabase
          .from('theses')
          .update(thesisData)
          .eq('id', thesis.id)
          .select()
          .single();
        if (error) {
          console.error("Error actualizando tesis:", error);
          throw new Error(`Error actualizando tesis: ${error.message}`);
        }
        if (!data) throw new Error(`No se encontró la tesis con ID: ${thesis.id}`);
        result = data;
      }
    } else {
      // Insert new thesis
      const dataToInsert = { ...thesisData, created_at: new Date().toISOString() };
      console.log("Insertando nueva tesis con datos:", dataToInsert);
      const { data, error } = await supabase
        .from('theses')
        .insert([dataToInsert])
        .select()
        .single();
      if (error) {
        console.error("Error insertando tesis:", error);
        throw new Error(`Error creando tesis: ${error.message}`);
      }
      if (!data) throw new Error('No se pudo crear la tesis, respuesta vacía del servidor');
      result = data;
    }

    console.log("Operación completada con éxito, resultado:", result);
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
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Error al guardar la tesis: ${message}`);
  }
}
