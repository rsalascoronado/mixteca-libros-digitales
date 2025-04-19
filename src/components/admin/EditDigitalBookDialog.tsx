import React, { useState } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PencilIcon } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DigitalBook } from '@/types/digitalBook';
import { Textarea } from '@/components/ui/textarea';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

const editDigitalBookSchema = z.object({
  formato: z.enum(['PDF', 'EPUB', 'MOBI', 'HTML'], {
    required_error: 'Debe seleccionar un formato',
  }),
  resumen: z.string().optional(),
  url: z.string().url('Debe ser una URL válida'),
});

type EditDigitalBookFormData = z.infer<typeof editDigitalBookSchema>;

interface EditDigitalBookDialogProps {
  digitalBook: DigitalBook;
  onEdit: (data: Partial<DigitalBook>) => void;
}

export function EditDigitalBookDialog({ digitalBook, onEdit }: EditDigitalBookDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<EditDigitalBookFormData>({
    resolver: zodResolver(editDigitalBookSchema),
    defaultValues: {
      formato: digitalBook.formato,
      resumen: digitalBook.resumen,
      url: digitalBook.url,
    },
  });

  const onSubmit = (data: EditDigitalBookFormData) => {
    onEdit(data);
    setOpen(false);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <PencilIcon className="h-4 w-4" />
        <span className="sr-only">Editar</span>
      </Button>

      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title="Editar archivo digital"
        footer={
          <Button type="submit" form="edit-digital-book-form" className="w-full sm:w-auto">
            Guardar cambios
          </Button>
        }
      >
        <Form {...form}>
          <form id="edit-digital-book-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="formato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formato</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar formato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="EPUB">EPUB</SelectItem>
                      <SelectItem value="MOBI">MOBI</SelectItem>
                      <SelectItem value="HTML">HTML</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del archivo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://ejemplo.com/archivo.pdf" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="resumen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumen</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Ingrese un resumen del archivo digital"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </ResponsiveDialog>
    </>
  );
}
