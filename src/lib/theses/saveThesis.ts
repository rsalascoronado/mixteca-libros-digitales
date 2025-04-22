
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

    // Si no hay sesión, verificar si se puede omitir autenticación para acciones de biblioteca
    let skipAuth = false;
    let currentUser = null;
    
    try {
      // En lugar de importar dinámicamente, usamos la información que ya tenemos
      // Verificar primero si estamos en modo de desarrollo para permitir operaciones sin autenticación
      if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
        console.log("Modo de desarrollo detectado, permitiendo operaciones sin autenticación");
        skipAuth = true;
      } else if (authData.session) {
        // Si hay sesión, verificar si el usuario tiene los permisos adecuados
        const userId = authData.session.user.id;
        // Obtener datos adicionales de usuario si es necesario para verificar roles
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single();
          
        if (userData) {
          currentUser = {
            id: userId,
            role: userData.role,
            // Otros campos necesarios para isStaffUser
          };
          // Verificar si es administrador o bibliotecario
          skipAuth = isStaffUser(currentUser);
        }
      }
      
      console.log("Verificación de autenticación: skipAuth:", skipAuth);
    } catch (err) {
      console.warn("No se pudo verificar el contexto de autenticación:", err);
      // En modo de desarrollo, permitir operaciones sin autenticación
      skipAuth = import.meta.env.DEV || import.meta.env.MODE === 'development';
    }

    // En desarrollo o con sesión válida, permitir la operación
    if (!authData.session && !skipAuth) {
      console.error('No session found and cannot skip auth');
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
