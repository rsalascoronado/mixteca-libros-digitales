
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export function UploadDigitalBookTrigger() {
  return (
    <Button size="sm">
      <Save className="mr-2 h-4 w-4" />
      Subir versión digital
    </Button>
  );
}
