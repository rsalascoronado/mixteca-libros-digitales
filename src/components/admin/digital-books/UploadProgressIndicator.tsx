
import React from 'react';

interface UploadProgressIndicatorProps {
  uploadProgress: number;
}

export function UploadProgressIndicator({ uploadProgress }: UploadProgressIndicatorProps) {
  return (
    <div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${uploadProgress}%` }}
        ></div>
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {Math.round(uploadProgress)}%
        </p>
      </div>
    </div>
  );
}
