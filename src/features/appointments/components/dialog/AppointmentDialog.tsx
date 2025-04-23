
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useAppointments } from '@/contexts/AppointmentContext';
import AppointmentDialogHeader from './AppointmentDialogHeader';
import AppointmentForm from './AppointmentForm';
import DeleteConfirmation from './DeleteConfirmation';
import DialogFooterActions from './DialogFooterActions';
import { useAppointmentDialog } from '../../hooks/dialog/useAppointmentDialog';
import { toast } from '@/hooks/use-toast';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({ open, onOpenChange }) => {
  const { setCurrentAppointment } = useAppointments();
  
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
  
  // Gestione del submit con feedback
  const onSubmit = async () => {
    try {
      await handleSubmit();
      
      // Il toast di successo è gestito nelle funzioni di add/update
      
    } catch (err) {
      // Errore già gestito dal hook, non serve fare nulla qui
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
      <DialogContent className="sm:max-w-[500px] appointment-form">
        <AppointmentDialogHeader isExistingAppointment={isExistingAppointment} />
        
        {showDeleteConfirm ? (
          <DeleteConfirmation
            isSubmitting={isSubmitting}
            onCancel={() => setShowDeleteConfirm(false)}
            onDelete={handleDelete}
          />
        ) : (
          <>
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
            
            <DialogFooterActions
              isExistingAppointment={isExistingAppointment}
              isSubmitting={isSubmitting}
              onShowDeleteConfirm={() => setShowDeleteConfirm(true)}
              onSubmit={onSubmit}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
