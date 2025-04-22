
import { useState, useCallback } from 'react';
import { BlockTimeFormData } from '../components/calendar/BlockTimeForm';

export interface StaffBlockTime {
  id: string;
  staffId: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  reason?: string;
  createdAt: Date;
  createdBy: string;
}

export const useStaffBlockTime = () => {
  const [blockTimes, setBlockTimes] = useState<StaffBlockTime[]>([]);

  const addBlockTime = useCallback((blockTimeData: BlockTimeFormData) => {
    const newBlockTime: StaffBlockTime = {
      id: crypto.randomUUID(),
      staffId: blockTimeData.staffId,
      startDate: blockTimeData.startDate || new Date(),
      endDate: blockTimeData.endDate || new Date(),
      startTime: blockTimeData.startTime,
      endTime: blockTimeData.endTime,
      reason: blockTimeData.reason,
      createdAt: new Date(),
      createdBy: 'current-user' // In a real implementation, this would be the current user's ID
    };

    setBlockTimes(prev => [...prev, newBlockTime]);
    
    return newBlockTime;
  }, []);

  const removeBlockTime = useCallback((blockTimeId: string) => {
    setBlockTimes(prev => prev.filter(bt => bt.id !== blockTimeId));
  }, []);

  const getStaffBlockTimes = useCallback((staffId: string) => {
    return blockTimes.filter(bt => bt.staffId === staffId);
  }, [blockTimes]);

  const isTimeBlocked = useCallback((staffId: string, date: Date, time: string) => {
    // Convert time to date object parts for comparison
    const [hours, minutes] = time.split(':').map(Number);
    const checkDate = new Date(date);
    checkDate.setHours(hours, minutes, 0, 0);
    
    return blockTimes.some(blockTime => {
      // Check if the date is within the block period
      if (checkDate < blockTime.startDate || checkDate > blockTime.endDate) {
        return false;
      }
      
      // Parse block time start and end
      const [blockStartHours, blockStartMinutes] = blockTime.startTime.split(':').map(Number);
      const [blockEndHours, blockEndMinutes] = blockTime.endTime.split(':').map(Number);
      
      // Create date objects for block start and end times on the check date
      const blockStartOnDay = new Date(checkDate);
      blockStartOnDay.setHours(blockStartHours, blockStartMinutes, 0, 0);
      
      const blockEndOnDay = new Date(checkDate);
      blockEndOnDay.setHours(blockEndHours, blockEndMinutes, 0, 0);
      
      // Check if the time is within block start and end times
      return checkDate >= blockStartOnDay && checkDate < blockEndOnDay && blockTime.staffId === staffId;
    });
  }, [blockTimes]);

  // Convert block times to FullCalendar background events
  const getBlockTimeEvents = useCallback(() => {
    return blockTimes.map(blockTime => {
      const startDateObj = new Date(blockTime.startDate);
      const [startHours, startMinutes] = blockTime.startTime.split(':').map(Number);
      startDateObj.setHours(startHours, startMinutes, 0, 0);
      
      const endDateObj = new Date(blockTime.endDate);
      const [endHours, endMinutes] = blockTime.endTime.split(':').map(Number);
      endDateObj.setHours(endHours, endMinutes, 0, 0);
      
      return {
        id: `block-${blockTime.id}`,
        resourceId: blockTime.staffId,
        start: startDateObj.toISOString(),
        end: endDateObj.toISOString(),
        display: 'background',
        color: 'rgba(211, 211, 211, 0.7)',
        classNames: ['blocked-time-event'],
        extendedProps: {
          isBlockedTime: true,
          reason: blockTime.reason
        }
      };
    });
  }, [blockTimes]);

  return {
    blockTimes,
    addBlockTime,
    removeBlockTime,
    getStaffBlockTimes,
    isTimeBlocked,
    getBlockTimeEvents
  };
};
