
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
    <div className="space-y-2">
      <Label htmlFor="notes">Note</Label>
      <Textarea
        id="notes"
        name="notes"
        value={formData.notes || ''}
        onChange={handleInputChange}
        placeholder="Note aggiuntive"
        rows={3}
      />
    </div>
  );
};
