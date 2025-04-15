
import React, { useState } from 'react';
import { UploadCloud, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DropZoneProps {
  file: File | null;
  setFile: (file: File | null) => void;
  uploadSuccess: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ file, setFile, uploadSuccess }) => {
  const [dragging, setDragging] = useState(false);

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

  return (
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
  );
};
