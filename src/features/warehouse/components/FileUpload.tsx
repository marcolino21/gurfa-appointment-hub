
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
import { Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface FileUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload: (file: File) => void;
  acceptedFileTypes: string;
  title: string;
  description: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  open,
  onOpenChange,
  onFileUpload,
  acceptedFileTypes,
  title,
  description,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check if file type is accepted
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!acceptedFileTypes.includes('*') && !acceptedFileTypes.includes(fileExtension)) {
      toast({
        title: "Formato file non supportato",
        description: `Sono accettati solo file ${acceptedFileTypes}`,
        variant: "destructive",
      });
      return;
    }
    
    // Set the file
    setFile(file);
  };

  const handleUpload = () => {
    if (file) {
      onFileUpload(file);
      setFile(null);
      onOpenChange(false);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-md p-6 text-center transition-colors ${
            isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : file 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {file ? (
            <div className="flex items-center justify-between bg-white p-3 rounded-md">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md mr-3">
                  <Upload size={20} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0" 
                onClick={removeFile}
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-700">
                Trascina qui il file o <span className="text-blue-500">sfoglia</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Formati supportati: {acceptedFileTypes}
              </p>
              <input
                type="file"
                accept={acceptedFileTypes}
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={handleUpload} disabled={!file}>
            Carica
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
