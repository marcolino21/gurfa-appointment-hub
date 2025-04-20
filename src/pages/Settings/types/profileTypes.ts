
export interface SalonProfile {
  id?: string;
  salon_id: string;
  business_name: string;
  phone?: string;
  address?: string;
  ragione_sociale?: string;
  email?: string;
  piva?: string;
  iban?: string;
  codice_fiscale?: string;
  sede_legale?: string;
  created_at?: string;
  updated_at?: string;
  business_hours?: BusinessHoursByDay;
}

export interface BusinessHoursByDay {
  monday?: { openTime: string; closeTime: string };
  tuesday?: { openTime: string; closeTime: string };
  wednesday?: { openTime: string; closeTime: string };
  thursday?: { openTime: string; closeTime: string };
  friday?: { openTime: string; closeTime: string };
  saturday?: { openTime: string; closeTime: string };
  sunday?: { openTime: string; closeTime: string };
}

export interface ProfileFormData {
  businessName: string;
  phone: string;
  address: string;
  ragioneSociale: string;
  email: string;
  piva: string;
  iban: string;
  codiceFiscale: string;
  sedeLegale: string;
  businessHours?: BusinessHoursByDay;
}
