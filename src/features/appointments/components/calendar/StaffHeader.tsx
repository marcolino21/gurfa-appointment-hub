
import React from 'react';
import { StaffMember } from '@/types';
import { MoreVertical, Lock } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { BlockTimeForm, BlockTimeFormData } from './BlockTimeForm';
import { ManageBlockTimesDialog } from './ManageBlockTimesDialog';
import { useStaffBlockTime } from '../../hooks/useStaffBlockTime';
import { useToast } from '@/hooks/use-toast';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger
} from "@/components/ui/tooltip";

interface StaffHeaderProps {
  staffMembers: StaffMember[];
}

export const StaffHeader: React.FC<StaffHeaderProps> = ({ staffMembers }) => {
  const [selectedStaff, setSelectedStaff] = React.useState<StaffMember | null>(null);
  const [isBlockTimeOpen, setIsBlockTimeOpen] = React.useState(false);
  const [isManageBlockTimesOpen, setIsManageBlockTimesOpen] = React.useState(false);
  const { addBlockTime, removeBlockTime, getStaffBlockTimes, isStaffBlocked } = useStaffBlockTime();
  const { toast } = useToast();

  const handleBlockTime = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsBlockTimeOpen(true);
  };

  const handleManageBlockTimes = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsManageBlockTimesOpen(true);
  };

  const handleSubmitBlockTime = (blockData: BlockTimeFormData) => {
    try {
      addBlockTime(blockData);
      setIsBlockTimeOpen(false);
      
      toast({
        title: "Orario bloccato",
        description: "L'orario è stato bloccato con successo",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il blocco dell'orario",
        variant: "destructive",
      });
    }
  };

  const handleRemoveBlockTime = (blockTimeId: string) => {
    try {
      removeBlockTime(blockTimeId);
      
      toast({
        title: "Blocco rimosso",
        description: "Il blocco è stato rimosso con successo",
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la rimozione del blocco",
        variant: "destructive",
      });
    }
  };

  const getStaffBlockTimesCount = (staffId: string) => {
    return getStaffBlockTimes(staffId).length;
  };

  return (
    <div className="staff-header-row" style={{
      display: 'grid',
      gridTemplateColumns: `80px repeat(${staffMembers.length}, 1fr)`
    }}>
      <div className="time-col-header"></div>
      {staffMembers.map(staff => {
        const blockTimesCount = getStaffBlockTimesCount(staff.id);
        const hasBlockTimes = blockTimesCount > 0;
        const isBlocked = isStaffBlocked ? isStaffBlocked(staff.id) : false;
        
        return (
          <div
            key={staff.id}
            className={`staff-header-col ${isBlocked ? 'blocked' : ''}`}
            style={{ borderLeft: `3px solid ${staff.color || "#9b87f5"}`}}
            data-blocked={isBlocked ? 'true' : 'false'}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="staff-name truncate">
                    {staff.firstName} {staff.lastName}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{staff.firstName} {staff.lastName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`ml-1 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary ${isBlocked ? 'text-red-500' : ''}`}>
                  {isBlocked ? <Lock className="h-4 w-4" /> : <MoreVertical className="h-4 w-4 text-gray-500" />}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-[9999]">
                <DropdownMenuItem onClick={() => handleBlockTime(staff)}>
                  Blocca orario
                </DropdownMenuItem>
                
                {hasBlockTimes && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleManageBlockTimes(staff)}>
                      {`Gestisci blocchi (${blockTimesCount})`}
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Modifica disponibilità
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Visualizza dettagli operatore
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}

      <Dialog open={isBlockTimeOpen} onOpenChange={setIsBlockTimeOpen}>
        <DialogContent className="sm:max-w-[425px] z-[9999]">
          <DialogHeader>
            <DialogTitle>
              Blocca orario{selectedStaff ? ` - ${selectedStaff.firstName} ${selectedStaff.lastName}` : ''}
            </DialogTitle>
          </DialogHeader>
          <BlockTimeForm 
            staffMember={selectedStaff}
            onCancel={() => setIsBlockTimeOpen(false)}
            onSubmit={handleSubmitBlockTime}
          />
        </DialogContent>
      </Dialog>

      <ManageBlockTimesDialog
        open={isManageBlockTimesOpen}
        onOpenChange={setIsManageBlockTimesOpen}
        blockTimes={selectedStaff ? getStaffBlockTimes(selectedStaff.id) : []}
        onRemoveBlockTime={handleRemoveBlockTime}
        staffMember={selectedStaff}
      />
    </div>
  );
};
