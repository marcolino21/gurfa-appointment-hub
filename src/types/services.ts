
export interface Service {
  id: string;
  name: string;
  category: string;
  description?: string;
  duration: number;
  tempoDiPosa: number;
  price: number;
  color: string;
  salonId: string;
  assignedStaffIds?: string[];
  assignedServiceIds: string[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  color: string;
  salonId: string;
}
