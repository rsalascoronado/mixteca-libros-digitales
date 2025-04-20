
import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { formatExtensionMap } from '@/utils/fileValidation';

interface FileUploadFieldProps {
  selectedFormat: string;
  selectedFileName: string | null;
  fileError: string | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export function FileUploadField({
  selectedFormat,
  selectedFileName,
  fileError,
  onFileSelect,
  fileInputRef
}: FileUploadFieldProps) {
  const formatAccept = React.useMemo(() => {
    const extensions = formatExtensionMap[selectedFormat] || [];
    return extensions.map(ext => `.${ext}`).join(',');
  }, [selectedFormat]);

  return (
    <FormItem>
      <FormLabel>Archivo</FormLabel>
      <FormControl>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileSelect}
            accept={formatAccept}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
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
      {selectedFileName && (
        <p className="text-sm text-muted-foreground mt-2 break-all">
          Archivo seleccionado: {selectedFileName}
        </p>
      )}
    </FormItem>
  );
}
