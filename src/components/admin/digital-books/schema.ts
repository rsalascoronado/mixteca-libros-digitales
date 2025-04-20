
import { z } from 'zod';

export const digitalBookSchema = z.object({
  formato: z.enum(['PDF', 'EPUB', 'MOBI', 'HTML'], {
    required_error: 'Debe seleccionar un formato',
  }),
  file: z.instanceof(File).refine((file) => file.size <= 100 * 1024 * 1024, `El archivo debe ser menor a 100MB`),
  resumen: z.string().optional(),
});

export type DigitalBookFormData = z.infer<typeof digitalBookSchema>;
