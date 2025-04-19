
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Book } from '@/types';
import { DigitalBook } from '@/types/digitalBook';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UploadDigitalBookForm } from './UploadDigitalBookForm';
import type { DigitalBookFormData } from './schema';

interface UploadDigitalBookDialogProps {
  book: Book;
  onAddDigitalBook: (bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => void;
}

export function UploadDigitalBookDialog({ book, onAddDigitalBook }: UploadDigitalBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: DigitalBookFormData) => {
    try {
      setIsUploading(true);
      
      const fileExt = data.file.name.split('.').pop();
      const fileName = `${book.id}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('digital-books')
        .upload(fileName, data.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('digital-books')
        .getPublicUrl(fileName);
      
      onAddDigitalBook(book.id, {
        formato: data.formato,
        url: publicUrl,
        tamanioMb: Number((data.file.size / (1024 * 1024)).toFixed(2)),
      });
      
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
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <UploadDigitalBookForm 
          onSubmit={handleSubmit}
          isUploading={isUploading}
        />
      </DialogContent>
    </Dialog>
  );
}
