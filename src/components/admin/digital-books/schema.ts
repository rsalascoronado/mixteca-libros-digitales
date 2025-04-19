
import { z } from 'zod';

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const digitalBookSchema = z.object({
  formato: z.enum(['PDF', 'EPUB', 'MOBI', 'HTML'], {
    required_error: 'Debe seleccionar un formato',
  }),
  file: z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, `El archivo debe ser menor a 100MB`),
});

export type DigitalBookFormData = z.infer<typeof digitalBookSchema>;
