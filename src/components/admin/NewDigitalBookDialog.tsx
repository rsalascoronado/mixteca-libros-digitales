
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BookPlus } from 'lucide-react';
import { Book, BookCategory } from '@/types';

const newBookSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  autor: z.string().min(1, 'El autor es requerido'),
  categoria: z.string().min(1, 'La categoría es requerida'),
  descripcion: z.string().min(1, 'El resumen es requerido'),
});

type NewBookFormData = z.infer<typeof newBookSchema>;

interface NewDigitalBookDialogProps {
  categories: BookCategory[];
  onAddBook: (book: Book) => void;
}

export function NewDigitalBookDialog({ categories, onAddBook }: NewDigitalBookDialogProps) {
  const [open, setOpen] = React.useState(false);

  const form = useForm<NewBookFormData>({
    resolver: zodResolver(newBookSchema),
    defaultValues: {
      titulo: '',
      autor: '',
      categoria: '',
      descripcion: '',
    },
  });

  const onSubmit = (data: NewBookFormData) => {
    const newBook: Book = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      isbn: '',
      copias: 1,
      disponibles: 1,
      editorial: '',
      anioPublicacion: new Date().getFullYear(),
      ubicacion: 'Digital',
    };
    
    onAddBook(newBook);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <BookPlus className="mr-2 h-4 w-4" />
          Nuevo libro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar nuevo libro digital</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ingrese el título del libro" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="autor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autor</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ingrese el autor" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.nombre}>
                          {category.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumen</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Ingrese un resumen del libro"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">
              <BookPlus className="mr-2 h-4 w-4" />
              Agregar libro
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
