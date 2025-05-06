import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useAppointments } from '@/features/appointments/hooks/useAppointments';
import { useServicesAndStaff } from '@/features/appointments/hooks/useServicesAndStaff';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment?: any;
  onSave: (data: any) => Promise<void>;
  defaultStart?: Date;
  defaultEnd?: Date;
}

export const AppointmentModal = ({
  isOpen,
  onClose,
  appointment,
  onSave,
  defaultStart,
  defaultEnd,
}: AppointmentModalProps) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientPhone: '',
    serviceId: '',
    staffId: '',
    status: 'pending',
    notes: '',
  });

  const toast = useToast();
  const { services, staff, loading, error } = useServicesAndStaff();

  useEffect(() => {
    if (appointment) {
      setFormData({
        clientName: appointment.clientName,
        clientPhone: appointment.clientPhone,
        serviceId: appointment.serviceId || '',
        staffId: appointment.staffId || '',
        status: appointment.status,
        notes: appointment.notes || '',
      });
    } else {
      setFormData({
        clientName: '',
        clientPhone: '',
        serviceId: '',
        staffId: '',
        status: 'pending',
        notes: '',
      });
    }
  }, [appointment]);

  const handleSubmit = async () => {
    try {
      await onSave(formData);
      toast({
        title: 'Appuntamento salvato',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Errore',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) return null;
  if (error) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {appointment ? 'Modifica Appuntamento' : 'Nuovo Appuntamento'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Cliente</FormLabel>
              <Input
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Nome del cliente"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Telefono</FormLabel>
              <Input
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                placeholder="Numero di telefono"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Servizio</FormLabel>
              <Select
                value={formData.serviceId}
                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                placeholder="Seleziona servizio"
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Staff</FormLabel>
              <Select
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                placeholder="Seleziona staff"
              >
                {staff.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Stato</FormLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">In attesa</option>
                <option value="confirmed">Confermato</option>
                <option value="completed">Completato</option>
                <option value="cancelled">Cancellato</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Note</FormLabel>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Aggiungi note..."
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Annulla
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Salva
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}; 