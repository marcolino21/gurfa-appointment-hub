
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DurationFieldsProps {
  startTime: string;
  setStartTime: (time: string) => void;
  duration: number;
  handleDurationChange: (value: string) => void;
  generateTimeOptions: () => string[];
  durations: Array<{ label: string; value: string; }>;
}

export const DurationFields = ({
  startTime,
  setStartTime,
  duration,
  handleDurationChange,
  generateTimeOptions,
  durations
}: DurationFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="startTime">Ora inizio *</Label>
        <Select value={startTime} onValueChange={setStartTime}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona ora" />
          </SelectTrigger>
          <SelectContent>
            {generateTimeOptions().map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Durata *</Label>
        <Select value={duration.toString()} onValueChange={handleDurationChange}>
          <SelectTrigger>
            <SelectValue placeholder="Durata" />
          </SelectTrigger>
          <SelectContent>
            {durations.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
