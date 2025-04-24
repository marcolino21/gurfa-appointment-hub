
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useStaffAppointments } from '../../hooks/useStaffAppointments';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_CLIENTS } from '@/data/mock/clients';
import { Client } from '@/types/clients';
import { ClientFields } from './form-fields/ClientFields';
import { ServiceFields } from './form-fields/ServiceFields';
import { DateTimeFields } from './form-fields/DateTimeFields';
import { DurationFields } from './form-fields/DurationFields';
import { NotesField } from './form-fields/NotesField';
import { useToast } from '@/hooks/use-toast';

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
  const { visibleStaff, services } = useStaffAppointments();
  const { currentSalonId } = useAuth();
  const { toast } = useToast();
  const [availableClients, setAvailableClients] = useState<Client[]>([]);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  const [openClientCombobox, setOpenClientCombobox] = useState(false);

  // Debug staffMembers
  useEffect(() => {
    console.log("AppointmentForm - visibleStaff:", visibleStaff);
    console.log("AppointmentForm - services:", services);
  }, [visibleStaff, services]);

  // Load clients for the current salon
  useEffect(() => {
    if (currentSalonId) {
      console.log("Loading clients for salon:", currentSalonId);
      const salonClients = MOCK_CLIENTS[currentSalonId] || [];
      setAvailableClients(salonClients);
      console.log("Loaded clients:", salonClients);
      
      if (salonClients.length === 0) {
        toast({
          title: "Nessun cliente",
          description: "Non ci sono clienti disponibili. Aggiungi clienti dalla sezione Clienti.",
        });
      }
      
      if (!services || services.length === 0) {
        toast({
          title: "Nessun servizio",
          description: "Non ci sono servizi disponibili. Aggiungi servizi dalla sezione Servizi.",
        });
      }
    }
  }, [currentSalonId, services, toast]);

  // Filter clients based on search term
  const filteredClients = clientSearchTerm === ''
    ? availableClients
    : availableClients.filter(client => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
        return fullName.includes(clientSearchTerm.toLowerCase());
      });

  const handleSelectClient = (clientName: string) => {
    console.log("Selected client:", clientName);
    handleInputChange({
      target: { name: 'clientName', value: clientName }
    } as React.ChangeEvent<HTMLInputElement>);
    setOpenClientCombobox(false);
    
    // Find the selected client and fill in the phone number if available
    const selectedClient = availableClients.find(client => 
      `${client.firstName} ${client.lastName}` === clientName
    );
    
    if (selectedClient?.phone) {
      console.log("Auto-filling phone:", selectedClient.phone);
      handleInputChange({
        target: { name: 'clientPhone', value: selectedClient.phone }
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  // For generating time options in time selectors
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour < 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  };
  
  // Duration options for the duration selector
  const durations = [
    { label: '15 minuti', value: '15' },
    { label: '30 minuti', value: '30' },
    { label: '45 minuti', value: '45' },
    { label: '1 ora', value: '60' },
    { label: '1.5 ore', value: '90' },
    { label: '2 ore', value: '120' }
  ];

  // Debug log for monitoring data
  useEffect(() => {
    console.log("Form data updated:", formData);
    console.log("Available services:", services?.length || 0);
    console.log("Available staff:", visibleStaff?.length || 0);
  }, [formData, services, visibleStaff]);

  return (
    <div className="grid gap-4 py-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <ClientFields
        formData={formData}
        handleInputChange={handleInputChange}
        availableClients={availableClients}
        clientSearchTerm={clientSearchTerm}
        setClientSearchTerm={setClientSearchTerm}
        openClientCombobox={openClientCombobox}
        setOpenClientCombobox={setOpenClientCombobox}
        handleSelectClient={handleSelectClient}
        filteredClients={filteredClients}
      />
      
      <ServiceFields
        formData={formData}
        handleInputChange={handleInputChange}
        visibleStaff={visibleStaff}
        services={services || []}
      />
      
      <DateTimeFields
        formData={formData}
        date={date}
        setDate={setDate}
        startTime={startTime}
        setStartTime={setStartTime}
        handleStatusChange={handleStatusChange}
        generateTimeOptions={generateTimeOptions}
      />
      
      <DurationFields
        startTime={startTime}
        setStartTime={setStartTime}
        duration={duration}
        handleDurationChange={handleDurationChange}
        generateTimeOptions={generateTimeOptions}
        durations={durations}
      />
      
      <NotesField
        formData={formData}
        handleInputChange={handleInputChange}
      />
    </div>
  );
};

export default AppointmentForm;
