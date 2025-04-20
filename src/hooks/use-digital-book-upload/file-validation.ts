
import { toast } from '@/components/ui/use-toast';
import { validateFileFormat, validateFileSize, getFormattedSize } from '@/utils/fileValidation';

export const validateUploadableFile = (
  file: File, 
  formato: string, 
  book: { id: string }
): { isValid: boolean; error?: string } => {
  const formatError = validateFileFormat(file, formato);
  if (formatError) {
    toast({
      title: "Formato incorrecto",
      description: formatError,
      variant: "destructive"
    });
    return { isValid: false, error: formatError };
  }

  const sizeError = validateFileSize(file);
  if (sizeError) {
    toast({
      title: "Error de tamaño",
      description: sizeError,
      variant: "destructive"
    });
    return { isValid: false, error: sizeError };
  }

  return { isValid: true };
};

export const generateDigitalBookFileName = (book: { id: string }, file: File) => {
  return `book-${book.id}-${Date.now()}.${file.name.split('.').pop()}`;
};
