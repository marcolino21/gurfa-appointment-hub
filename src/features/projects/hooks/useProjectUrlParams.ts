
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { UseFormSetValue } from 'react-hook-form';
import { ProjectFormValues } from '@/types';

export const useProjectUrlParams = (setValue: UseFormSetValue<ProjectFormValues>) => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const clientId = params.get('clientId');
    
    if (clientId) {
      setValue('clientId', clientId);
    }
  }, [location.search, setValue]);
};
