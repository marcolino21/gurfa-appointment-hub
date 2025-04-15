
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
import { AlertCircle, Check, UploadCloud } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

interface CsvImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  open,
  onOpenChange,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Formato file non valido",
          description: "Per favore seleziona un file CSV",
          variant: "destructive",
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        toast({
          title: "Formato file non valido",
          description: "Per favore seleziona un file CSV",
          variant: "destructive",
        });
      }
    }
  };

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
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Assicurati che il file CSV sia nel formato corretto. Scarica il <a href="#" className="text-blue-500 underline">template</a>.
            </AlertDescription>
          </Alert>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } ${file ? 'bg-green-50' : ''} transition-colors`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!file ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <UploadCloud className="h-12 w-12 text-gray-400" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Trascina qui il tuo file o{" "}
                    <label className="cursor-pointer text-blue-500 hover:text-blue-600">
                      sfoglia
                      <input
                        type="file"
                        className="sr-only"
                        accept=".csv"
                        onChange={handleFileChange}
                      />
                    </label>
                  </p>
                  <p className="text-xs text-gray-500">
                    Solo file CSV fino a 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {uploadSuccess ? (
                  <div className="flex justify-center">
                    <Check className="h-12 w-12 text-green-500" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 justify-center">
                    <div className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded">
                      <span className="text-xs font-medium">.CSV</span>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium break-all">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Annulla
          </Button>
          <Button
            onClick={handleUpload}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
