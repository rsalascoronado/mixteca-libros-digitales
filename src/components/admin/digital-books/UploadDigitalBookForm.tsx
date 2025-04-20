
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';

const uploadFormSchema = z.object({
  formato: z.enum(['PDF', 'EPUB', 'MOBI', 'HTML'], {
    required_error: 'Debe seleccionar un formato',
  }),
  file: z.instanceof(File).refine((file) => file.size <= 100 * 1024 * 1024, `El archivo debe ser menor a 100MB`),
  resumen: z.string().optional(),
});

type UploadFormData = z.infer<typeof uploadFormSchema>;

interface UploadDigitalBookFormProps {
  onSubmit: (data: UploadFormData) => Promise<void>;
  isUploading: boolean;
}

export function UploadDigitalBookForm({ onSubmit, isUploading }: UploadDigitalBookFormProps) {
  const [isFileSelected, setIsFileSelected] = React.useState(false);
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
      setIsFileSelected(true);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
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
                  className="min-h-[80px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={!isFileSelected || isUploading}
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
  );
}
