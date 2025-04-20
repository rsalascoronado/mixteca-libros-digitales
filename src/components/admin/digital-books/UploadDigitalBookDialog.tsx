
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { Book } from '@/types';
import { useDigitalBookUpload } from '@/hooks/use-digital-book-upload';
import { uploadFormSchema, UploadDigitalBookFormData } from './schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadProgressIndicator } from './UploadProgressIndicator';
import { UploadDigitalBookForm } from './UploadDigitalBookForm';

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
  
  const { isUploading, uploadProgress, uploadError, handleUpload, handleRetry } = useDigitalBookUpload(book, (data) => {
    onUploadComplete(data);
    // Only close the dialog after successful upload
    setTimeout(() => setOpen(false), 1500);
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
        // Reset form when opening dialog
        if (newOpen) {
          clearFileSelection();
          form.reset({
            formato: 'PDF',
            resumen: '',
          });
        }
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
        
        <UploadDigitalBookForm
          form={form}
          isUploading={isUploading}
          isFileSelected={isFileSelected}
          fileError={fileError}
          selectedFileName={selectedFileName}
          fileInputRef={fileInputRef}
          onFileSelect={handleFileSelect}
          onSubmit={handleSubmit}
          clearFileSelection={clearFileSelection}
        />
        
        {(isUploading || uploadError) && (
          <UploadProgressIndicator 
            uploadProgress={uploadProgress} 
            error={uploadError}
            onRetry={handleRetry}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
