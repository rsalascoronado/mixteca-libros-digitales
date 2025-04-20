
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
  const [loadError, setLoadError] = React.useState(false);

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
    setLoadError(false);
  };

  const handleIframeError = () => {
    setLoadError(true);
  };

  // Para visualización en desarrollo usamos un PDF de ejemplo
  const fallbackUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title={fileName ? fileName : 'Visualización de documento'}
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
            {fileName ? 'Ver' : 'Ver documento'}
          </span>
        </Button>
      }
    >
      {isAuthenticated ? (
        <ScrollArea className="h-full w-full rounded-md">
          {loadError ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">
                No se pudo cargar el documento. 
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Posibles razones:
                <ul className="list-disc pl-6 mt-2">
                  <li>El enlace al documento no es accesible</li>
                  <li>El formato del documento no es compatible</li>
                  <li>Restricciones de seguridad del navegador</li>
                </ul>
              </p>
              <Button 
                onClick={() => window.open(url, '_blank')}
                className="mt-4"
              >
                Descargar documento
              </Button>
            </div>
          ) : (
            <iframe
              src={url.startsWith('http') ? url : fallbackUrl}
              className="w-full h-[calc(80vh-80px)]"
              title="PDF Viewer"
              onError={handleIframeError}
            />
          )}
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
