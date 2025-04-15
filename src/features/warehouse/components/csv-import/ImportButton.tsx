
import React from 'react';
import { Button } from '@/components/ui/button';

interface ImportButtonProps {
  file: File | null;
  uploading: boolean;
  uploadSuccess: boolean;
  onUpload: () => void;
}

export const ImportButton: React.FC<ImportButtonProps> = ({ 
  file, 
  uploading, 
  uploadSuccess, 
  onUpload 
}) => {
  return (
    <Button
      onClick={onUpload}
      disabled={!file || uploading || uploadSuccess}
      className="relative"
    >
      {uploading ? (
        <>
          <span className="opacity-0">Importa</span>
          <span className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white" />
          </span>
        </>
      ) : uploadSuccess ? (
        "Completato"
      ) : (
        "Importa"
      )}
    </Button>
  );
};
