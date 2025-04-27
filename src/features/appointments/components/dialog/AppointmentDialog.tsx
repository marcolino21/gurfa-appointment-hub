
import React, { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppointments } from '@/contexts/AppointmentContext';
import { useAppointmentDialog } from '../../hooks/dialog/useAppointmentDialog';
import { useToast } from '@/hooks/use-toast';
import AppointmentDialogContent from './components/AppointmentDialogContent';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({ open, onOpenChange }) => {
  const { setCurrentAppointment, currentAppointment } = useAppointments();
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
    handleDelete,
    resetForm
  } = useAppointmentDialog(handleClose);
  
  const isExistingAppointment = Boolean(formData.id);

  // Resetta il form quando si riapre il dialog con un nuovo appuntamento
  useEffect(() => {
    if (open && currentAppointment) {
      console.log("Dialog opened with appointment:", currentAppointment);
      resetForm();
    }
  }, [open, currentAppointment, resetForm]);
  
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
        <AppointmentDialogContent
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          formData={formData}
          date={date}
          setDate={setDate}
          startTime={startTime}
          setStartTime={setStartTime}
          duration={duration}
          error={error}
          isSubmitting={isSubmitting}
          handleInputChange={handleInputChange}
          handleStatusChange={handleStatusChange}
          handleDurationChange={handleDurationChange}
          handleDelete={handleDelete}
          onSubmit={onSubmit}
          isExistingAppointment={isExistingAppointment}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
