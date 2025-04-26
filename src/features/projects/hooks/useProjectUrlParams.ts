
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { UseFormSetValue } from 'react-hook-form';
import { ProjectFormValues } from '@/types';

export const useProjectUrlParams = (setValue: UseFormSetValue<ProjectFormValues>) => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    const clientId = searchParams.get('clientId');
    
    if (clientId) {
      setValue('clientId', clientId);
    }
  }, [searchParams, setValue]);
};
