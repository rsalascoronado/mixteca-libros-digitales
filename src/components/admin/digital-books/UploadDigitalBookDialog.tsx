
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Book } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const uploadFormSchema = z.object({
  formato: z.enum(['PDF', 'EPUB', 'MOBI', 'HTML'], {
    required_error: 'Debe seleccionar un formato',
  }),
  file: z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, `El archivo debe ser menor a 100MB`),
});

type UploadFormData = z.infer<typeof uploadFormSchema>;

interface UploadDigitalBookDialogProps {
  book: Book;
  onUploadComplete: () => void;
}

export function UploadDigitalBookDialog({ book, onUploadComplete }: UploadDigitalBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<UploadFormData>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      formato: 'PDF',
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

  const onSubmit = async (data: UploadFormData) => {
    try {
      setIsUploading(true);
      const file = data.file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${book.id}-${Date.now()}.${fileExt}`;
      
      // Subir archivo a Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('digital-books')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Obtener URL pública del archivo
      const { data: { publicUrl } } = supabase.storage
        .from('digital-books')
        .getPublicUrl(fileName);
      
      // Crear registro en la tabla digital_books
      const { error: dbError } = await supabase
        .from('digital_books')
        .insert({
          book_id: book.id,
          formato: data.formato,
          url: publicUrl,
          tamanio_mb: Number((file.size / (1024 * 1024)).toFixed(2)),
        });

      if (dbError) throw dbError;
      
      setOpen(false);
      onUploadComplete();
      
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
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Upload className="mr-2 h-4 w-4" />
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
                  {form.watch('file') && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Archivo seleccionado: {form.watch('file').name}
                    </p>
                  )}
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={!form.watch('file') || isUploading}
            >
              {isUploading ? (
                <>Subiendo archivo...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar archivo
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
