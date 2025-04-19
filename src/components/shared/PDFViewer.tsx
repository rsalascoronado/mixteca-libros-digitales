
import React from 'react';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

interface PDFViewerProps {
  url: string;
  fileName?: string;
}

const PDFViewer = ({ url, fileName }: PDFViewerProps) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const handleOpenPDF = () => {
    if (!isAuthenticated) {
      toast({
        title: "Acceso restringido",
        description: "Debes iniciar sesión para ver los documentos digitales.",
        variant: "destructive",
      });
      return;
    }
    setOpen(true);
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title={fileName ? fileName : 'Visualización de PDF'}
      className="max-w-4xl h-[80vh]"
      trigger={
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 text-primary hover:text-primary/80"
          onClick={handleOpenPDF}
        >
          <FileText className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">
            {fileName ? 'Ver' : 'Ver PDF'}
          </span>
        </Button>
      }
    >
      {isAuthenticated ? (
        <ScrollArea className="h-full w-full rounded-md">
          <iframe
            src={url}
            className="w-full h-[calc(80vh-80px)]"
            title="PDF Viewer"
          />
        </ScrollArea>
      ) : (
        <div className="py-6 text-center text-muted-foreground">
          Debe iniciar sesión para ver los documentos digitales.
        </div>
      )}
    </ResponsiveDialog>
  );
};

export default PDFViewer;
