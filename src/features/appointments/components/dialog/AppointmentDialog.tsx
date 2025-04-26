
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppointments } from '@/contexts/AppointmentContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppointmentDialogHeader from './AppointmentDialogHeader';
import AppointmentForm from './AppointmentForm';
import DeleteConfirmation from './DeleteConfirmation';
import DialogFooterActions from './DialogFooterActions';
import { useAppointmentDialog } from '../../hooks/dialog/useAppointmentDialog';
import { useToast } from '@/hooks/use-toast';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({ open, onOpenChange }) => {
  const { setCurrentAppointment } = useAppointments();
  const { toast } = useToast();
  
  const handleClose = () => {
    onOpenChange(false);
    setCurrentAppointment(null);
  };
  
  const {
    formData,
    date,
    setDate,
    startTime,
    setStartTime,
    duration,
    error,
    isSubmitting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleInputChange,
    handleStatusChange,
    handleDurationChange,
    handleSubmit,
    handleDelete
  } = useAppointmentDialog(handleClose);
  
  const isExistingAppointment = Boolean(formData.id);

  useEffect(() => {
    if (error) {
      toast({
        title: "Errore",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  const onSubmit = async () => {
    try {
      await handleSubmit();
    } catch (err) {
      console.error("Errore durante il salvataggio dell'appuntamento:", err);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={newOpen => {
      if (!newOpen) {
        setCurrentAppointment(null);
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] p-0 gap-0 appointment-form bg-gray-50 border-none">
        <AppointmentDialogHeader isExistingAppointment={isExistingAppointment} />
        
        <ScrollArea className="max-h-[calc(90vh-160px)] overflow-y-auto px-6">
          {showDeleteConfirm ? (
            <DeleteConfirmation
              isSubmitting={isSubmitting}
              onCancel={() => setShowDeleteConfirm(false)}
              onDelete={handleDelete}
            />
          ) : (
            <AppointmentForm
              formData={formData}
              date={date}
              setDate={setDate}
              startTime={startTime}
              setStartTime={setStartTime}
              duration={duration}
              handleInputChange={handleInputChange}
              handleStatusChange={handleStatusChange}
              handleDurationChange={handleDurationChange}
              error={error}
            />
          )}
        </ScrollArea>
        
        {!showDeleteConfirm && (
          <div className="p-6 pt-4 border-t bg-white">
            <DialogFooterActions
              isExistingAppointment={isExistingAppointment}
              isSubmitting={isSubmitting}
              onShowDeleteConfirm={() => setShowDeleteConfirm(true)}
              onSubmit={onSubmit}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
