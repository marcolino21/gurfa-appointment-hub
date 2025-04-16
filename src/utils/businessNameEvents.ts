
// Define a custom event type for business name updates
export const BUSINESS_NAME_CHANGE_EVENT = 'salon_business_name_change';

// Function to dispatch a business name change event
export const dispatchBusinessNameChange = (newName: string) => {
  // Use the storage event as a communication channel between components
  localStorage.setItem('salon_business_name', newName);
  
  // Dispatch a custom event
  window.dispatchEvent(new CustomEvent(BUSINESS_NAME_CHANGE_EVENT, { 
    detail: { businessName: newName } 
  }));
};

// Hook to listen for business name changes
export const addBusinessNameChangeListener = (callback: (name: string) => void) => {
  const handleChange = (event: Event) => {
    const customEvent = event as CustomEvent;
    callback(customEvent.detail.businessName);
  };
  
  window.addEventListener(BUSINESS_NAME_CHANGE_EVENT, handleChange);
  
  return () => {
    window.removeEventListener(BUSINESS_NAME_CHANGE_EVENT, handleChange);
  };
};
