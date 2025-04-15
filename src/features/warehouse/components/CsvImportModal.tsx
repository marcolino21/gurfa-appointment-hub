
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { DropZone } from './csv-import/DropZone';
import { ImportAlert } from './csv-import/ImportAlert';
import { ImportButton } from './csv-import/ImportButton';

interface CsvImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess?: (updatedProducts: any[]) => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  open,
  onOpenChange,
  onImportSuccess,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = () => {
    if (!file) return;

    setUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);
      
      toast({
        title: "Importazione completata",
        description: `${file.name} è stato importato con successo.`,
      });
      
      // Call the onImportSuccess callback if provided
      if (onImportSuccess) {
        // Mock updated products data
        const mockUpdatedProducts = [
          { id: 'p1', name: 'Product 1', stockQuantity: 25 },
          { id: 'p2', name: 'Product 2', stockQuantity: 30 }
        ];
        onImportSuccess(mockUpdatedProducts);
      }
      
      // Reset after success
      setTimeout(() => {
        setFile(null);
        setUploadSuccess(false);
        onOpenChange(false);
      }, 1500);
    }, 2000);
  };

  const handleCancel = () => {
    setFile(null);
    setUploadSuccess(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Importa prodotti da CSV</DialogTitle>
          <DialogDescription>
            Carica un file CSV con i prodotti da importare.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <ImportAlert />
          
          <DropZone 
            file={file}
            setFile={setFile}
            uploadSuccess={uploadSuccess}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Annulla
          </Button>
          <ImportButton
            file={file}
            uploading={uploading}
            uploadSuccess={uploadSuccess}
            onUpload={handleUpload}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
