
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileUp, Save } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Book } from '@/types';
import { DigitalBook } from '@/types/digitalBook';
import { useToast } from '@/hooks/use-toast';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const digitalBookSchema = z.object({
  formato: z.enum(['PDF', 'EPUB', 'MOBI', 'HTML'], {
    required_error: 'Debe seleccionar un formato',
  }),
  file: z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, `El archivo debe ser menor a 100MB`),
});

type DigitalBookFormData = z.infer<typeof digitalBookSchema>;

interface UploadDigitalBookDialogProps {
  book: Book;
  onAddDigitalBook: (bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => void;
}

export function UploadDigitalBookDialog({ book, onAddDigitalBook }: UploadDigitalBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const form = useForm<DigitalBookFormData>({
    resolver: zodResolver(digitalBookSchema),
    defaultValues: {
      formato: 'PDF',
    },
  });

  const onSubmit = async (data: DigitalBookFormData) => {
    try {
      const url = URL.createObjectURL(data.file);
      
      onAddDigitalBook(book.id, {
        formato: data.formato,
        url: url,
        tamanioMb: Number((data.file.size / (1024 * 1024)).toFixed(2)),
      });
      
      form.reset();
      setIsFileSelected(false);
      setOpen(false);
      
      toast({
        title: "Archivo digital guardado",
        description: "Se ha guardado el archivo digital correctamente."
      });
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el archivo digital.",
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('file', file);
      setIsFileSelected(true);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleDialogClose = () => {
    form.reset();
    setIsFileSelected(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button size="sm">
          <FileUp className="h-4 w-4 mr-2" />
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
              name="file"
              render={({ field: { onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Archivo</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".pdf,.epub,.mobi,.html"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={triggerFileInput}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Seleccionar archivo
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                  {isFileSelected && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Archivo seleccionado: {fileInputRef.current?.files?.[0]?.name}
                    </p>
                  )}
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={!isFileSelected}
            >
              <Save className="mr-2 h-4 w-4" />
              Guardar archivo
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
