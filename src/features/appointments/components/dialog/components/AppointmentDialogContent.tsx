
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppointmentDialogHeader from '../AppointmentDialogHeader';
import AppointmentForm from '../AppointmentForm';
import DeleteConfirmation from '../DeleteConfirmation';
import DialogFooterActions from '../DialogFooterActions';

interface AppointmentDialogContentProps {
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  formData: any;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  duration: number;
  error: string | null;
  isSubmitting: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (value: string) => void;
  handleDurationChange: (value: string) => void;
  handleDelete: () => void;
  onSubmit: () => void;
  isExistingAppointment: boolean;
}

const AppointmentDialogContent: React.FC<AppointmentDialogContentProps> = ({
  showDeleteConfirm,
  setShowDeleteConfirm,
  formData,
  date,
  setDate,
  startTime,
  setStartTime,
  duration,
  error,
  isSubmitting,
  handleInputChange,
  handleStatusChange,
  handleDurationChange,
  handleDelete,
  onSubmit,
  isExistingAppointment
}) => {
  return (
    <>
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
    </>
  );
};

export default AppointmentDialogContent;
