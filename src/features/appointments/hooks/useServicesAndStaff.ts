import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useServicesAndStaff = () => {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .order('name');

        if (servicesError) throw servicesError;
        setServices(servicesData);

        // Fetch staff
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .order('name');

        if (staffError) throw staffError;
        setStaff(staffData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    services,
    staff,
    loading,
    error
  };
}; 