
import { z } from 'zod';

export const uploadFormSchema = z.object({
  formato: z.enum(['PDF', 'EPUB', 'MOBI', 'HTML'], {
    required_error: 'Debe seleccionar un formato',
  }),
  file: z.instanceof(File).refine((file) => file.size <= 50 * 1024 * 1024, `El archivo debe ser menor a 50MB`),
  resumen: z.string().optional(),
});

export type UploadDigitalBookFormData = z.infer<typeof uploadFormSchema>;
