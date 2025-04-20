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
  business_hours?: {
    open_days: string[];
    open_time: string;
    close_time: string;
  };
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
  businessHours?: {
    openDays: string[];
    openTime: string;
    closeTime: string;
  };
}
