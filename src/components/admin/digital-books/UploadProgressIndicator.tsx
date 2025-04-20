
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface UploadProgressIndicatorProps {
  uploadProgress: number;
  error?: string | null;
}

export function UploadProgressIndicator({ 
  uploadProgress, 
  error 
}: UploadProgressIndicatorProps) {
  const isComplete = uploadProgress === 100;
  const hasError = !!error;
  
  return (
    <div className="space-y-2">
      <Progress 
        value={uploadProgress} 
        className={hasError ? "bg-red-100" : isComplete ? "bg-green-100" : ""}
      />
      
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center">
          {hasError && (
            <div className="flex items-center text-destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>{error}</span>
            </div>
          )}
          
          {isComplete && !hasError && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span>Completado</span>
            </div>
          )}
        </div>
        
        <p className={`text-xs ${hasError ? 'text-destructive' : 'text-muted-foreground'}`}>
          {Math.round(uploadProgress)}%
        </p>
      </div>
    </div>
  );
}
