
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

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
        className={`transition-all duration-300 ${hasError ? "bg-red-100" : isComplete ? "bg-green-100" : ""}`}
      />
      
      <div className="flex justify-between items-start text-xs">
        <div className="flex items-start max-w-[90%]">
          {hasError && (
            <div className="flex items-start text-destructive gap-1">
              <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
              <span className="break-words">{error}</span>
            </div>
          )}
          
          {isComplete && !hasError && (
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-3 w-3 mr-1 shrink-0" />
              <span>Completado</span>
            </div>
          )}
          
          {!isComplete && !hasError && uploadProgress > 0 && (
            <div className="flex items-center text-blue-600">
              <Info className="h-3 w-3 mr-1 shrink-0" />
              <span>Subiendo archivo...</span>
            </div>
          )}
        </div>
        
        <p className={`text-xs ${hasError ? 'text-destructive' : isComplete ? 'text-green-600' : 'text-muted-foreground'}`}>
          {Math.round(uploadProgress)}%
        </p>
      </div>
    </div>
  );
}
