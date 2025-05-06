import { useState } from 'react';
import {
  Box,
  Input,
  Select,
  HStack,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { AppointmentModal } from './AppointmentModal';
import { useServicesAndStaff } from '@/features/appointments/hooks/useServicesAndStaff';

export const CalendarHeader = () => {
  const [filters, setFilters] = useState({
    staff: '',
    service: '',
    status: '',
    search: ''
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { services, staff, loading, error } = useServicesAndStaff();

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) return <Box>Caricamento...</Box>;
  if (error) return <Box color="red.500">Errore: {error}</Box>;

  return (
    <Box>
      <HStack spacing={4} mb={4}>
        <Input
          placeholder="Cerca cliente..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          width="200px"
        />
        
        <Select
          value={filters.staff}
          onChange={(e) => handleFilterChange('staff', e.target.value)}
          placeholder="Tutto lo staff"
          width="200px"
        >
          {staff.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </Select>

        <Select
          value={filters.service}
          onChange={(e) => handleFilterChange('service', e.target.value)}
          placeholder="Tutti i servizi"
          width="200px"
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </Select>

        <Select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          placeholder="Tutti gli stati"
          width="200px"
        >
          <option value="pending">In attesa</option>
          <option value="confirmed">Confermato</option>
          <option value="completed">Completato</option>
          <option value="cancelled">Cancellato</option>
        </Select>

        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          onClick={onOpen}
        >
          Nuovo Appuntamento
        </Button>
      </HStack>

      <AppointmentModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={async (data) => {
          // Implementare la logica di salvataggio
          onClose();
        }}
      />
    </Box>
  );
}; 