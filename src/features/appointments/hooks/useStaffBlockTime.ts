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

  // NEW: Add isStaffBlocked function to check if a staff is currently blocked
  const isStaffBlocked = useCallback((staffId: string) => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return isTimeBlocked(staffId, now, currentTime);
  }, [isTimeBlocked]);

  // Convert block times to background events for the scheduler
  const blockTimeEvents = blockTimes.map(block => ({
    id: `block-${block.id}`,
    title: 'Blocco',
    start: block.startTime,
    end: block.endTime,
    resourceId: block.staffId,
    bgColor: '#f0f0f0',
    showPopover: false
  }));

  return {
    blockTimes,
    addBlockTime,
    removeBlockTime,
    getStaffBlockTimes,
    isTimeBlocked,
    blockTimeEvents,
    isStaffBlocked // Added the new function to the return object
  };
};
