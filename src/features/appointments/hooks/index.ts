
// Core hooks
export { useAppointmentEvents } from './useAppointmentEvents';
export { useAppointmentHandlers } from './useAppointmentHandlers';
export { useStaffAppointments } from './useStaffAppointments';
export { useStaffBlockTime } from './useStaffBlockTime';
export { useBusinessHours } from './useBusinessHours';
export { useAppointmentProvider } from './useAppointmentProvider';

// Dialog hooks
export * from './dialog/useAppointmentDialog';
export * from './dialog/useAppointmentClients';
export * from './dialog/useAppointmentDelete';
export * from './dialog/useAppointmentDialogState';
export * from './dialog/useAppointmentForm';
export * from './dialog/useAppointmentFormHandlers';
export * from './dialog/useAppointmentFormState';
export * from './dialog/useAppointmentSubmit';
export * from './dialog/useAppointmentTime';
export * from './dialog/useDefaultResources';
export * from './dialog/useServiceFieldsState';
export * from './dialog/useStaffIdNormalization';

// Calendar sync hooks
export * from './calendar-sync/useMasterSlaveScroll';
export * from './calendar-sync/useScrollSystemSetup';
export { useAutoScroll } from './useAutoScroll';
export { useMasterSlaveScroll } from './useMasterSlaveScroll';

// Actions
export * from './appointment-actions/useAddAppointment';
export * from './appointment-actions/useFetchAppointments';
export * from './appointment-actions/useUpdateAppointment';
