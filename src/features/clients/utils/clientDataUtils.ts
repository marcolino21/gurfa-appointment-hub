
import { MOCK_CLIENTS } from '@/data/mock/clients';
import { Client } from '@/types';

/**
 * Retrieves clients for a specific salon
 * @param salonId The ID of the salon
 * @returns Array of clients for the specified salon
 */
export const getSalonClients = async (salonId: string): Promise<Client[]> => {
  // In a real application, this would be an API call to a backend
  // For now, we're using mock data
  return MOCK_CLIENTS[salonId] || [];
};
