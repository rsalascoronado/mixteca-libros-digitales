
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import React from 'react';
import { uploadFormSchema, UploadDigitalBookFormData } from './schema';

interface UploadDigitalBookFormProps {
  onSubmit: (data: UploadDigitalBookFormData) => Promise<void>;
  isUploading: boolean;
}

export function UploadDigitalBookForm({ onSubmit, isUploading }: UploadDigitalBookFormProps) {
  const [isFileSelected, setIsFileSelected] = React.useState(false);
  const [selectedFileName, setSelectedFileName] = React.useState<string | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<UploadDigitalBookFormData>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      formato: 'PDF',
    },
  });

  const selectedFormat = form.watch('formato');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    
    if (file) {
      // Validate file extension
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const formatExtMap: Record<string, string[]> = {
        'PDF': ['pdf'],
        'EPUB': ['epub'],
        'MOBI': ['mobi', 'azw', 'azw3'],
        'HTML': ['html', 'htm']
      };
      
      const validExtensions = formatExtMap[selectedFormat] || [];
      
      if (fileExt && !validExtensions.includes(fileExt)) {
        setFileError(`El formato del archivo (.${fileExt}) no coincide con el formato seleccionado (${selectedFormat})`);
        return;
      }
      
      // Validate file size
      if (file.size > 50 * 1024 * 1024) {
        setFileError('El archivo excede el límite de 50MB permitido.');
        return;
      }
      
      form.setValue('file', file);
      setIsFileSelected(true);
      setSelectedFileName(file.name);
    } else {
      form.setValue('file', undefined);
      setIsFileSelected(false);
      setSelectedFileName(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatAccept = React.useMemo(() => {
    switch (selectedFormat) {
      case 'PDF': return '.pdf';
      case 'EPUB': return '.epub';
      case 'MOBI': return '.mobi,.azw,.azw3';
      case 'HTML': return '.html,.htm';
      default: return '.pdf,.epub,.mobi,.html';
    }
  }, [selectedFormat]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="formato"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formato</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                if (isFileSelected) {
                  // Clear file selection if format changes
                  fileInputRef.current!.value = '';
                  setIsFileSelected(false);
                  setSelectedFileName(null);
                  form.setValue('file', undefined);
                }
              }} defaultValue={field.value}>
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
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept={formatAccept}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={triggerFileInput}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Seleccionar archivo {selectedFormat}
                  </Button>
                </div>
              </FormControl>
              {fileError && (
                <p className="text-sm font-medium text-destructive mt-2">
                  {fileError}
                </p>
              )}
              <FormMessage />
              {isFileSelected && selectedFileName && (
                <p className="text-sm text-muted-foreground mt-2 break-all">
                  Archivo seleccionado: {selectedFileName}
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
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={!isFileSelected || isUploading || !!fileError}
        >
          {isUploading ? (
            <>Subiendo archivo ({Math.round(uploadProgress)}%)...</>
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
