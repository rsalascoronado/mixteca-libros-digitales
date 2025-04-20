
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Edit, Upload, Trash2 } from 'lucide-react';
import { Book, BookCategory } from '@/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useThesisFileUpload } from '@/hooks/useThesisFileUpload';
import { useToast } from '@/hooks/use-toast';

const bookSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  autor: z.string().min(1, 'El autor es requerido'),
  isbn: z.string().min(1, 'El ISBN es requerido'),
  categoria: z.string().min(1, 'La categoría es requerida'),
  disponibles: z.coerce.number().min(0, 'El número debe ser positivo'),
  copias: z.coerce.number().min(0, 'El número debe ser positivo'),
  file: z.instanceof(File).optional(),
});

type BookFormData = z.infer<typeof bookSchema>;

interface EditBookDialogProps {
  book: Book;
  categories: BookCategory[];
  onEditBook: (id: string, bookData: Partial<Book>) => void;
}

export function EditBookDialog({ book, categories, onEditBook }: EditBookDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { uploadThesisFile, deleteThesisFile, isUploading, uploadProgress } = useThesisFileUpload();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const form = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      titulo: book.titulo,
      autor: book.autor,
      isbn: book.isbn,
      categoria: book.categoria,
      disponibles: book.disponibles,
      copias: book.copias,
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('file', file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: BookFormData) => {
    try {
      // Upload file if provided
      let fileUrl: string | undefined;
      if (data.file) {
        fileUrl = await uploadThesisFile(data.file, book.id);
      }

      // Update book data
      onEditBook(book.id, {
        titulo: data.titulo,
        autor: data.autor,
        isbn: data.isbn,
        categoria: data.categoria,
        disponibles: data.disponibles,
        copias: data.copias,
        archivo: fileUrl || book.archivo,
      });

      setOpen(false);
      toast({
        title: "Libro actualizado",
        description: "Los cambios han sido guardados exitosamente."
      });
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el libro.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteFile = async () => {
    if (book.archivo) {
      try {
        await deleteThesisFile(book.archivo);
        onEditBook(book.id, { archivo: null });
        toast({
          title: "Archivo eliminado",
          description: "El archivo digital ha sido eliminado exitosamente."
        });
      } catch (error) {
        console.error('Error al eliminar el archivo:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el archivo digital.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex w-full items-center justify-start">
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar libro</DialogTitle>
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
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ISBN</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                        <SelectValue placeholder="Selecciona una categoría" />
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
              name="disponibles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ejemplares disponibles</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="copias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total de copias</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Archivo digital</FormLabel>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".pdf,.epub,.mobi"
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={triggerFileInput}
                        disabled={isUploading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {isUploading ? `Subiendo... ${uploadProgress}%` : 'Seleccionar archivo'}
                      </Button>
                      {book.archivo && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleDeleteFile}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar archivo</span>
                        </Button>
                      )}
                    </div>
                    {book.archivo && (
                      <p className="text-sm text-muted-foreground">
                        Archivo actual: {new URL(book.archivo).pathname.split('/').pop()}
                      </p>
                    )}
                    {form.watch('file') && (
                      <p className="text-sm text-muted-foreground">
                        Nuevo archivo: {form.watch('file')?.name}
                      </p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isUploading}>
              Guardar cambios
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
