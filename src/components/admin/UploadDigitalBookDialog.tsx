
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileUp } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Book } from '@/types';
import { DigitalBook } from '@/types/digitalBook';

const digitalBookSchema = z.object({
  formato: z.enum(['PDF', 'EPUB', 'MOBI', 'HTML'], {
    required_error: 'Debe seleccionar un formato',
  }),
  url: z.string().url({ message: 'Debe ser una URL válida' }),
  tamanioMb: z.coerce.number().positive({ message: 'El tamaño debe ser mayor a 0' }),
});

type DigitalBookFormData = z.infer<typeof digitalBookSchema>;

interface UploadDigitalBookDialogProps {
  book: Book;
  onAddDigitalBook: (bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => void;
}

export function UploadDigitalBookDialog({ book, onAddDigitalBook }: UploadDigitalBookDialogProps) {
  const [open, setOpen] = useState(false);
  
  const form = useForm<DigitalBookFormData>({
    resolver: zodResolver(digitalBookSchema),
    defaultValues: {
      formato: 'PDF',
      url: '',
      tamanioMb: 0,
    },
  });

  const onSubmit = (data: DigitalBookFormData) => {
    onAddDigitalBook(book.id, data);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <FileUp className="mr-2 h-4 w-4" />
          Subir versión digital
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subir versión digital de "{book.titulo}"</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input placeholder="https://ejemplo.com/archivo.pdf" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tamanioMb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamaño (MB)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Subir archivo
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
