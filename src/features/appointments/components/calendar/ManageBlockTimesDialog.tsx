
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StaffBlockTime } from '../../hooks/useStaffBlockTime';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { StaffMember } from '@/types';
import { X } from 'lucide-react';

interface ManageBlockTimesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blockTimes: StaffBlockTime[];
  onRemoveBlockTime: (blockTimeId: string) => void;
  staffMember: StaffMember | null;
}

export const ManageBlockTimesDialog: React.FC<ManageBlockTimesDialogProps> = ({
  open,
  onOpenChange,
  blockTimes,
  onRemoveBlockTime,
  staffMember
}) => {
  if (!staffMember) return null;

  const formatTimeRange = (blockTime: StaffBlockTime) => {
    const isSameDay = blockTime.startDate.toDateString() === blockTime.endDate.toDateString();
    
    if (isSameDay) {
      // If it's the same day, show only one date with time range
      return `${format(blockTime.startDate, 'dd/MM/yyyy')} dalle ${blockTime.startTime} alle ${blockTime.endTime}`;
    } else {
      // If it's a period, show date range with time range
      return `Dal ${format(blockTime.startDate, 'dd/MM/yyyy')} al ${format(blockTime.endDate, 'dd/MM/yyyy')} dalle ${blockTime.startTime} alle ${blockTime.endTime}`;
    }
  };

  const hasBlockTimes = blockTimes.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Gestisci orari bloccati - {staffMember.firstName} {staffMember.lastName}
          </DialogTitle>
          <DialogDescription>
            {hasBlockTimes ? 
              'Di seguito sono elencati tutti gli orari bloccati per questo operatore.' : 
              'Non ci sono orari bloccati per questo operatore.'}
          </DialogDescription>
        </DialogHeader>

        {hasBlockTimes && (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {blockTimes.map(blockTime => (
              <div 
                key={blockTime.id} 
                className="flex justify-between items-center border p-3 rounded-md"
              >
                <div className="flex-1">
                  <div className="font-medium">{formatTimeRange(blockTime)}</div>
                  {blockTime.reason && (
                    <div className="text-sm text-gray-500">{blockTime.reason}</div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveBlockTime(blockTime.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Rimuovi blocco</span>
                </Button>
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Chiudi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
