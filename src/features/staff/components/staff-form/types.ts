
import { StaffFormValues } from '../../types';
import { Service } from '@/types';

export interface StaffFormProps {
  defaultValues?: StaffFormValues;
  services: Service[];
  onSubmit: (data: StaffFormValues) => void;
  isEdit?: boolean;
}
