
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
import { Separator } from '@/components/ui/separator';
import { Service } from '@/types/services';
import { StaffMember } from '@/types/staff';

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
  const [validationError, setValidationError] = useState<string | null>(null);

  // Create default staff if none are available
  const displayedStaff: StaffMember[] = visibleStaff && visibleStaff.length > 0 ? visibleStaff : [
    {
      id: 'default-staff-1',
      firstName: 'Operatore',
      lastName: 'Predefinito',
      email: 'operatore@esempio.it',
      isActive: true,
      showInCalendar: true,
      salonId: currentSalonId || 'default'
    }
  ];

  // Create default services if none are available
  const displayedServices: Service[] = services && services.length > 0 ? services : [
    { 
      id: 'default-service-1',
      name: 'Servizio Generico',
      category: 'default',
      description: 'Servizio predefinito',
      duration: 30,
      tempoDiPosa: 0,
      price: 30,
      color: '#9b87f5',
      salonId: currentSalonId || 'default',
      assignedServiceIds: []
    }
  ];

  useEffect(() => {
    console.log("AppointmentForm - visibleStaff:", visibleStaff);
    console.log("AppointmentForm - services:", services);
    console.log("AppointmentForm - formData:", formData);
    
    // Inizializza serviceEntries se non esistono
    if (!formData.serviceEntries || formData.serviceEntries.length === 0) {
      const event = {
        target: {
          name: 'serviceEntries',
          value: [{ serviceId: displayedServices[0]?.id || '', staffId: displayedStaff[0]?.id || '' }]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleInputChange(event);
    }
  }, [visibleStaff, services, formData, displayedStaff, displayedServices, handleInputChange]);

  useEffect(() => {
    if (!formData.clientName || formData.clientName.trim() === '') {
      setValidationError('Il nome del cliente è obbligatorio');
    } else {
      setValidationError(null);
    }
  }, [formData.clientName]);

  useEffect(() => {
    if (currentSalonId) {
      console.log("Loading clients for salon:", currentSalonId);
      let salonClients = MOCK_CLIENTS[currentSalonId] || [];
      
      // Add a default client if none are available
      if (salonClients.length === 0) {
        salonClients = [
          {
            id: 'default-client-1',
            firstName: 'Cliente',
            lastName: 'Di Prova',
            gender: 'M' as 'M',
            salonId: currentSalonId,
            isPrivate: true,
            phone: '3331234567'
          }
        ];
      }
      
      setAvailableClients(salonClients);
      console.log("Loaded clients:", salonClients.length);
      
      if (salonClients.length === 0) {
        toast({
          title: "Clienti di prova caricati",
          description: "È stato aggiunto un cliente di prova per poter creare appuntamenti.",
        });
      }
      
      if (!services || services.length === 0) {
        toast({
          title: "Servizi di prova caricati",
          description: "È stato aggiunto un servizio di prova per poter creare appuntamenti.",
        });
      }
    }
  }, [currentSalonId, services, toast]);

  const filteredClients = clientSearchTerm === ''
    ? availableClients
    : availableClients.filter(client => {
        const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
        return fullName.includes(clientSearchTerm.toLowerCase());
      });

  const handleSelectClient = (clientName: string) => {
    console.log("Selected client:", clientName);
    
    // Importante: prima imposta il nome del cliente
    const clientEvent = {
      target: { name: 'clientName', value: clientName }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    handleInputChange(clientEvent);
    
    // Poi resetta il termine di ricerca
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

  const durations = [
    { label: '15 minuti', value: '15' },
    { label: '30 minuti', value: '30' },
    { label: '45 minuti', value: '45' },
    { label: '1 ora', value: '60' },
    { label: '1.5 ore', value: '90' },
    { label: '2 ore', value: '120' }
  ];

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
            durations={durations}
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
