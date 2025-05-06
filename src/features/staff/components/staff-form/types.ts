
import { StaffFormValues } from '../../types';
import { Service } from '@/types';
import { UseFormReturn } from 'react-hook-form';

export interface StaffFormProps {
  defaultValues?: StaffFormValues;
  services: Service[];
  onSubmit: (data: StaffFormValues) => void;
  isEdit?: boolean;
}

export interface FormTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  form: UseFormReturn<StaffFormValues>;
  services: Service[];
}

export interface FormFooterProps {
  isEdit: boolean;
  form: UseFormReturn<StaffFormValues>;
}
