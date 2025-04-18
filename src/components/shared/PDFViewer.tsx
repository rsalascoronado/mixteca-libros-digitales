
import React from 'react';
import { FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PDFViewerProps {
  url: string;
  fileName?: string;
}

const PDFViewer = ({ url, fileName }: PDFViewerProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 text-primary hover:text-primary/80">
          <FileText className="h-4 w-4" />
          {fileName ? fileName : 'Ver PDF'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>{fileName ? fileName : 'Visualización de PDF'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full w-full rounded-md">
          <iframe
            src={url}
            className="w-full h-[calc(80vh-80px)]"
            title="PDF Viewer"
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;
