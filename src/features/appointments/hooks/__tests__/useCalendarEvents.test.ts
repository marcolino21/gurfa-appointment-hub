import { renderHook, act } from '@testing-library/react';
import { useCalendarEvents } from '../useCalendarEvents';
import { useToast } from '@/hooks/use-toast';

// Mock useToast
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn()
}));

describe('useCalendarEvents', () => {
  const mockToast = jest.fn();
  const mockCalendarApi = {
    getEvents: jest.fn()
  };

  beforeEach(() => {
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    jest.clearAllMocks();
  });

  it('should handle event drag start correctly', () => {
    const { result } = renderHook(() => useCalendarEvents(mockCalendarApi));
    
    const mockEvent = {
      id: '1',
      title: 'Test Event',
      start: new Date('2024-03-20T10:00:00'),
      end: new Date('2024-03-20T11:00:00'),
      resourceId: 'staff1',
      extendedProps: {
        clientName: 'Test Client',
        serviceType: 'Test Service',
        staffMember: 'Test Staff',
        resourceId: 'staff1'
      }
    };

    const mockInfo = {
      event: mockEvent,
      el: {
        style: {
          opacity: '',
          cursor: ''
        }
      },
      preventDefault: jest.fn()
    };

    mockCalendarApi.getEvents.mockReturnValue([]);

    act(() => {
      result.current.handleEventDragStart(mockInfo);
    });

    expect(result.current.isDragging).toBe(true);
    expect(mockInfo.el.style.opacity).toBe('0.7');
    expect(mockInfo.el.style.cursor).toBe('grabbing');
  });

  it('should prevent drag if there are overlapping events', () => {
    const { result } = renderHook(() => useCalendarEvents(mockCalendarApi));
    
    const mockEvent = {
      id: '1',
      title: 'Test Event',
      start: new Date('2024-03-20T10:00:00'),
      end: new Date('2024-03-20T11:00:00'),
      resourceId: 'staff1',
      extendedProps: {
        clientName: 'Test Client',
        serviceType: 'Test Service',
        staffMember: 'Test Staff',
        resourceId: 'staff1'
      }
    };

    const mockOverlappingEvent = {
      id: '2',
      title: 'Overlapping Event',
      start: new Date('2024-03-20T10:30:00'),
      end: new Date('2024-03-20T11:30:00'),
      resourceId: 'staff1',
      extendedProps: {
        clientName: 'Test Client 2',
        serviceType: 'Test Service 2',
        staffMember: 'Test Staff',
        resourceId: 'staff1'
      }
    };

    const mockInfo = {
      event: mockEvent,
      el: {
        style: {
          opacity: '',
          cursor: ''
        }
      },
      preventDefault: jest.fn()
    };

    mockCalendarApi.getEvents.mockReturnValue([mockOverlappingEvent]);

    act(() => {
      result.current.handleEventDragStart(mockInfo);
    });

    expect(mockInfo.preventDefault).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith({
      title: "Conflitto di appuntamenti",
      description: "Esiste già un appuntamento in questo orario.",
      variant: "destructive"
    });
  });

  it('should handle event drag stop with invalid time', () => {
    const { result } = renderHook(() => useCalendarEvents(mockCalendarApi));
    
    const mockEvent = {
      id: '1',
      title: 'Test Event',
      start: new Date('2024-03-20T07:00:00'), // Before business hours
      end: new Date('2024-03-20T08:00:00'),
      resourceId: 'staff1',
      extendedProps: {
        clientName: 'Test Client',
        serviceType: 'Test Service',
        staffMember: 'Test Staff',
        resourceId: 'staff1'
      }
    };

    const mockInfo = {
      event: mockEvent,
      el: {
        style: {
          opacity: '',
          cursor: ''
        }
      },
      revert: jest.fn()
    };

    act(() => {
      result.current.handleEventDragStop(mockInfo);
    });

    expect(result.current.isDragging).toBe(false);
    expect(mockInfo.revert).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith({
      title: "Validazione fallita",
      description: "Gli appuntamenti devono essere all'interno dell'orario di lavoro (8:00-20:00).",
      variant: "destructive"
    });
  });

  it('should handle event drag stop with valid time', () => {
    const { result } = renderHook(() => useCalendarEvents(mockCalendarApi));
    
    const mockEvent = {
      id: '1',
      title: 'Test Event',
      start: new Date('2024-03-20T10:00:00'),
      end: new Date('2024-03-20T11:00:00'),
      resourceId: 'staff1',
      extendedProps: {
        clientName: 'Test Client',
        serviceType: 'Test Service',
        staffMember: 'Test Staff',
        resourceId: 'staff1'
      }
    };

    const mockInfo = {
      event: mockEvent,
      el: {
        style: {
          opacity: '',
          cursor: ''
        }
      },
      revert: jest.fn()
    };

    act(() => {
      result.current.handleEventDragStop(mockInfo);
    });

    expect(result.current.isDragging).toBe(false);
    expect(mockInfo.revert).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith({
      title: "Appuntamento aggiornato",
      description: "L'appuntamento è stato spostato con successo.",
      variant: "default"
    });
  });

  it('should handle event resize start correctly', () => {
    const { result } = renderHook(() => useCalendarEvents(mockCalendarApi));
    
    const mockInfo = {
      event: {
        id: '1',
        title: 'Test Event',
        start: new Date('2024-03-20T10:00:00'),
        end: new Date('2024-03-20T11:00:00'),
        resourceId: 'staff1',
        extendedProps: {
          clientName: 'Test Client',
          serviceType: 'Test Service',
          staffMember: 'Test Staff',
          resourceId: 'staff1'
        }
      },
      el: {
        style: {
          opacity: ''
        }
      }
    };

    act(() => {
      result.current.handleEventResizeStart(mockInfo);
    });

    expect(result.current.isResizing).toBe(true);
    expect(mockInfo.el.style.opacity).toBe('0.7');
  });

  it('should handle event resize stop with invalid duration', () => {
    const { result } = renderHook(() => useCalendarEvents(mockCalendarApi));
    
    const mockEvent = {
      id: '1',
      title: 'Test Event',
      start: new Date('2024-03-20T10:00:00'),
      end: new Date('2024-03-20T15:00:00'), // 5 hours duration
      resourceId: 'staff1',
      extendedProps: {
        clientName: 'Test Client',
        serviceType: 'Test Service',
        staffMember: 'Test Staff',
        resourceId: 'staff1'
      }
    };

    const mockInfo = {
      event: mockEvent,
      el: {
        style: {
          opacity: ''
        }
      },
      revert: jest.fn()
    };

    act(() => {
      result.current.handleEventResizeStop(mockInfo);
    });

    expect(result.current.isResizing).toBe(false);
    expect(mockInfo.revert).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith({
      title: "Validazione fallita",
      description: "La durata massima di un appuntamento è di 4 ore.",
      variant: "destructive"
    });
  });

  it('should handle event resize stop with valid duration', () => {
    const { result } = renderHook(() => useCalendarEvents(mockCalendarApi));
    
    const mockEvent = {
      id: '1',
      title: 'Test Event',
      start: new Date('2024-03-20T10:00:00'),
      end: new Date('2024-03-20T11:00:00'), // 1 hour duration
      resourceId: 'staff1',
      extendedProps: {
        clientName: 'Test Client',
        serviceType: 'Test Service',
        staffMember: 'Test Staff',
        resourceId: 'staff1'
      }
    };

    const mockInfo = {
      event: mockEvent,
      el: {
        style: {
          opacity: ''
        }
      },
      revert: jest.fn()
    };

    act(() => {
      result.current.handleEventResizeStop(mockInfo);
    });

    expect(result.current.isResizing).toBe(false);
    expect(mockInfo.revert).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith({
      title: "Durata aggiornata",
      description: "La durata dell'appuntamento è stata modificata con successo.",
      variant: "default"
    });
  });

  it('should handle event resize stop with too short duration', () => {
    const { result } = renderHook(() => useCalendarEvents(mockCalendarApi));
    
    const mockEvent = {
      id: '1',
      title: 'Test Event',
      start: new Date('2024-03-20T10:00:00'),
      end: new Date('2024-03-20T10:15:00'), // 15 minutes duration
      resourceId: 'staff1',
      extendedProps: {
        clientName: 'Test Client',
        serviceType: 'Test Service',
        staffMember: 'Test Staff',
        resourceId: 'staff1'
      }
    };

    const mockInfo = {
      event: mockEvent,
      el: {
        style: {
          opacity: ''
        }
      },
      revert: jest.fn()
    };

    act(() => {
      result.current.handleEventResizeStop(mockInfo);
    });

    expect(result.current.isResizing).toBe(false);
    expect(mockInfo.revert).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith({
      title: "Validazione fallita",
      description: "La durata minima di un appuntamento è di 30 minuti.",
      variant: "destructive"
    });
  });
}); 