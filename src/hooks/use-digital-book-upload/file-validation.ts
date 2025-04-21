import { useState, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/epub+zip', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Esta función ahora recibe user (o roles), o bien podemos obtener el user dentro del hook usando useAuth.
export function useFileValidation() {
  const { user } = useAuth();

  function validateFile(file: File): string | null {
    // Si el usuario es admin o bibliotecario, no validamos nada.
    if (user?.rol === "administrador" || user?.rol === "bibliotecario") {
      return null; // Sin restricción
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Tipo de archivo no permitido. Solo se permiten archivos PDF, EPUB, TXT y DOC/DOCX.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "El archivo es demasiado grande. El tamaño máximo permitido es de 50MB.";
    }

    return null;
  }

  return {
    validateFile,
  };
}
