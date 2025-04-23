
import { useState } from 'react';

export const useAppointmentDialogState = () => {
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return {
    error,
    setError,
    showDeleteConfirm,
    setShowDeleteConfirm,
    isSubmitting,
    setIsSubmitting
  };
};
