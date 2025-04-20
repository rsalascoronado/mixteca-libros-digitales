
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Book } from '@/types';
import { useDigitalBookUpload } from '@/hooks/use-digital-book-upload';
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
  const { isUploading, uploadProgress, handleUpload } = useDigitalBookUpload(book, (data) => {
    onUploadComplete(data);
    setOpen(false);
  });

  const handleSubmit = async (data: { formato: string; file: File; resumen?: string }) => {
    await handleUpload(data.file, data.formato, data.resumen);
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
        
        <UploadDigitalBookForm 
          onSubmit={handleSubmit}
          isUploading={isUploading}
        />
        
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {uploadProgress}%
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
