
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BusinessHoursByDay {
  monday?: { openTime: string; closeTime: string };
  tuesday?: { openTime: string; closeTime: string };
  wednesday?: { openTime: string; closeTime: string };
  thursday?: { openTime: string; closeTime: string };
  friday?: { openTime: string; closeTime: string };
  saturday?: { openTime: string; closeTime: string };
  sunday?: { openTime: string; closeTime: string };
}

export const useBusinessHours = (selectedDate: Date) => {
  const [businessHours, setBusinessHours] = useState<BusinessHoursByDay>({});
  const [hiddenDays, setHiddenDays] = useState<number[]>([]);
  const [slotMinTime, setSlotMinTime] = useState('08:00:00');
  const [slotMaxTime, setSlotMaxTime] = useState('20:00:00');

  useEffect(() => {
    async function fetchBusinessHours() {
      const salonId = localStorage.getItem('currentSalonId');
      if (!salonId) {
        setDefaults();
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('salon_profiles')
          .select('business_hours')
          .eq('salon_id', salonId)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching business hours:", error);
          setDefaults();
          return;
        }
        
        if (data && data.business_hours) {
          const hoursData = data.business_hours as BusinessHoursByDay;
          setBusinessHours(hoursData);

          const dayMap = [
            'sunday', 'monday', 'tuesday', 'wednesday',
            'thursday', 'friday', 'saturday'
          ];
          
          // Ensure hidden days array is constructed correctly
          const hidden: number[] = [];
          
          // For each day index (0-6), check if it should be hidden (no business hours)
          for (let idx = 0; idx < 7; idx++) {
            const dayKey = dayMap[idx] as keyof BusinessHoursByDay;
            if (!hoursData[dayKey]) {
              hidden.push(idx);
            }
          }
          
          // IMPORTANT: FullCalendar requires at least one visible day
          // If all days would be hidden, show Monday (index 1) as fallback
          if (hidden.length === 7) {
            console.log("All days would be hidden, showing Monday as fallback");
            setHiddenDays([0, 2, 3, 4, 5, 6]); // Hide all except Monday (index 1)
            // Set default hours for Monday if all days are hidden
            setSlotMinTime('08:00:00');
            setSlotMaxTime('20:00:00');
          } else {
            console.log("Hidden days calculated:", hidden);
            setHiddenDays(hidden);

            let currentDate = new Date(selectedDate);
            const dayOfWeek = currentDate.getDay();
            const todayKey = dayMap[dayOfWeek] as keyof BusinessHoursByDay;
            const todayHours = hoursData[todayKey];
            
            if (todayHours) {
              setSlotMinTime(todayHours.openTime + ':00');
              setSlotMaxTime(todayHours.closeTime + ':00');
            } else {
              // Find first open day for fallback hours
              const firstOpenDayKey = Object.keys(hoursData)[0] as keyof BusinessHoursByDay;
              if (firstOpenDayKey && hoursData[firstOpenDayKey]) {
                setSlotMinTime(hoursData[firstOpenDayKey].openTime + ':00');
                setSlotMaxTime(hoursData[firstOpenDayKey].closeTime + ':00');
              } else {
                setSlotMinTime('08:00:00');
                setSlotMaxTime('20:00:00');
              }
            }
          }
        } else {
          setDefaults();
        }
      } catch (fetchError) {
        console.error("Failed to fetch business hours:", fetchError);
        setDefaults();
      }
    }
    
    fetchBusinessHours();
  }, [selectedDate]);

  const setDefaults = () => {
    setBusinessHours({});
    // Show all days by default when no business hours are set
    setHiddenDays([]);
    setSlotMinTime('08:00:00');
    setSlotMaxTime('20:00:00');
  };

  return {
    businessHours,
    hiddenDays,
    slotMinTime,
    slotMaxTime
  };
};
