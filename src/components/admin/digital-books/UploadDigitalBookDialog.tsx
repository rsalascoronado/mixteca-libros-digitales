
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Book } from '@/types';
import { useDigitalBookUpload } from '@/hooks/use-digital-book-upload';
import { uploadFormSchema, UploadDigitalBookFormData } from './schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { FileUploadField } from './FileUploadField';
import { UploadDigitalBookFormats } from './UploadDigitalBookFormats';

interface UploadDigitalBookDialogProps {
  book: Book;
  onUploadComplete: (data: {
    formato: string;
    url: string;
    tamanioMb: number;
    resumen?: string;
    storage_path?: string;
  }) => void;
}

export function UploadDigitalBookDialog({ book, onUploadComplete }: UploadDigitalBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const { isUploading, uploadProgress, handleUpload } = useDigitalBookUpload(book, (data) => {
    onUploadComplete(data);
    setOpen(false);
  });

  const form = useForm<UploadDigitalBookFormData>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      formato: 'PDF',
    },
  });

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
      
      const selectedFormat = form.getValues('formato');
      const validExtensions = formatExtMap[selectedFormat] || [];
      
      if (fileExt && !validExtensions.includes(fileExt)) {
        setFileError(`El formato del archivo (.${fileExt}) no coincide con el formato seleccionado (${selectedFormat})`);
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

  const clearFileSelection = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setIsFileSelected(false);
    setSelectedFileName(null);
    form.setValue('file', undefined);
  };

  const handleSubmit = async (data: UploadDigitalBookFormData) => {
    try {
      if (data.file) {
        const result = await handleUpload(data.file, data.formato, data.resumen);
        if (result) {
          console.log('Upload completed successfully');
        }
      }
    } catch (error) {
      console.error('Error handling submission:', error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (isUploading && !newOpen) return;
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Save className="mr-2 h-4 w-4" />
          Subir versión digital
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subir versión digital de "{book.titulo}"</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="formato"
              render={({ field }) => (
                <UploadDigitalBookFormats
                  value={field.value}
                  onValueChange={field.onChange}
                  onFormatChange={clearFileSelection}
                />
              )}
            />
            
            <FileUploadField
              selectedFormat={form.getValues('formato')}
              selectedFileName={selectedFileName}
              fileError={fileError}
              onFileSelect={handleFileSelect}
              fileInputRef={fileInputRef}
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
        
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {Math.round(uploadProgress)}%
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
