
import { supabase } from '@/integrations/supabase/client';

// Auxiliary function to check UUID format
function isValidUUID(id: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
}

export async function deleteThesis(id: string): Promise<void> {
  try {
    const { data: authData, error: authError } = await supabase.auth.getSession();

    if (authError) {
      throw new Error(`Error de autenticación: ${authError.message}`);
    }

    if (!authData.session) {
      throw new Error('Debes iniciar sesión para eliminar tesis');
    }

    // If mock thesis, nothing to do.
    if (!isValidUUID(id)) {
      console.log(`Intentando eliminar tesis con ID no válido: ${id}, operación simulada`);
      return;
    }

    const { error } = await supabase
      .from('theses')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error eliminando tesis: ${error.message}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Error al eliminar la tesis: ${message}`);
  }
}
