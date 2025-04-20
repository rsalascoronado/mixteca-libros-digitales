
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface UploadProgressIndicatorProps {
  uploadProgress: number;
}

export function UploadProgressIndicator({ uploadProgress }: UploadProgressIndicatorProps) {
  return (
    <div className="space-y-2">
      <Progress value={uploadProgress} />
      <p className="text-xs text-muted-foreground text-right">
        {Math.round(uploadProgress)}%
      </p>
    </div>
  );
}
