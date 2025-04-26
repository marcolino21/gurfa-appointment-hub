
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotesFieldProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const NotesField = ({
  formData,
  handleInputChange
}: NotesFieldProps) => {
  return (
    <div className="space-y-2 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <div className="font-medium text-base mb-2 text-gray-800">Note</div>
      <Textarea
        id="notes"
        name="notes"
        placeholder="Aggiungi note per l'appuntamento..."
        value={formData.notes || ''}
        onChange={handleInputChange}
        className="h-24 w-full resize-none border rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};
