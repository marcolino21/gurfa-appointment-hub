
import React, { useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useStaffAppointments } from '../../hooks/useStaffAppointments';
import { useAppointmentClients } from '../../hooks/dialog/useAppointmentClients';
import { useDefaultResources } from '../../hooks/dialog/useDefaultResources';
import { ClientFields } from './form-fields/ClientFields';
import { ServiceFields } from './form-fields/ServiceFields';
import { DateTimeFields } from './form-fields/DateTimeFields';
import { DurationFields } from './form-fields/DurationFields';
import { NotesField } from './form-fields/NotesField';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { generateTimeOptions, durationOptions } from './form-fields/time/TimeOptions';

interface AppointmentFormProps {
  formData: any;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  duration: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleStatusChange: (value: string) => void;
  handleDurationChange: (value: string) => void;
  error: string | null;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  formData,
  date,
  setDate,
  startTime,
  setStartTime,
  duration,
  handleInputChange,
  handleStatusChange,
  handleDurationChange,
  error
}) => {
  const { visibleStaff, services, refreshVisibleStaff } = useStaffAppointments();
  const { toast } = useToast();
  const { displayedStaff, displayedServices } = useDefaultResources(visibleStaff, services);
  const {
    clientSearchTerm,
    setClientSearchTerm,
    validationError,
    filteredClients,
    availableClients
  } = useAppointmentClients();

  // Forza un refresh dei dati quando il componente viene montato
  useEffect(() => {
    refreshVisibleStaff();
  }, [refreshVisibleStaff]);

  // Inizializza serviceEntries se non esistono
  useEffect(() => {
    if (!formData.serviceEntries || formData.serviceEntries.length === 0) {
      console.log("Initializing service entries with default values");
      
      const event = {
        target: {
          name: 'serviceEntries',
          value: [{ 
            serviceId: displayedServices[0]?.id || '', 
            staffId: displayedStaff[0]?.id || '' 
          }]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(event);
    } else {
      console.log("Existing service entries:", formData.serviceEntries);
    }
  }, [displayedStaff, displayedServices, formData.serviceEntries, handleInputChange]);

  // Gestione della selezione del cliente
  const handleSelectClient = (clientName: string) => {
    console.log("Selected client:", clientName);
    
    const clientEvent = {
      target: { name: 'clientName', value: clientName }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(clientEvent);
    setClientSearchTerm('');
    
    const selectedClient = availableClients.find(client => 
      `${client.firstName} ${client.lastName}` === clientName
    );
    
    if (selectedClient?.phone) {
      console.log("Auto-filling phone:", selectedClient.phone);
      const phoneEvent = {
        target: { name: 'clientPhone', value: selectedClient.phone }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(phoneEvent);
    }
  };

  // Notifiche per l'utente
  useEffect(() => {
    if (services.length === 0 || visibleStaff.length === 0) {
      toast({
        title: "Dati predefiniti caricati",
        description: "Sono stati caricati servizi e operatori predefiniti per creare appuntamenti.",
      });
    }
  }, [services, visibleStaff, toast]);

  return (
    <div className="space-y-6 py-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
        <ClientFields
          formData={formData}
          handleInputChange={handleInputChange}
          availableClients={availableClients}
          clientSearchTerm={clientSearchTerm}
          setClientSearchTerm={setClientSearchTerm}
          handleSelectClient={handleSelectClient}
          filteredClients={filteredClients}
          error={validationError}
        />
      </div>
      
      <Separator className="my-4 bg-gray-200" />
      
      <ServiceFields
        formData={formData}
        handleInputChange={handleInputChange}
        visibleStaff={displayedStaff}
        services={displayedServices}
      />
      
      <Separator className="my-4 bg-gray-200" />
      
      <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm">
        <div className="font-medium text-lg text-gray-800 mb-3 border-b pb-2">Data e Orario</div>
        <DateTimeFields
          formData={formData}
          date={date}
          setDate={setDate}
          startTime={startTime}
          setStartTime={setStartTime}
          handleStatusChange={handleStatusChange}
          generateTimeOptions={generateTimeOptions}
        />
        
        <div className="mt-4">
          <DurationFields
            startTime={startTime}
            setStartTime={setStartTime}
            duration={duration}
            handleDurationChange={handleDurationChange}
            generateTimeOptions={generateTimeOptions}
            durations={durationOptions}
          />
        </div>
      </div>
      
      <Separator className="my-4 bg-gray-200" />
      
      <NotesField
        formData={formData}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};

export default AppointmentForm;
