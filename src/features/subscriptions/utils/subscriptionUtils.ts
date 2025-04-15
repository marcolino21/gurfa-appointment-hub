
export const getRecurrenceLabel = (recurrenceType: string) => {
  switch (recurrenceType) {
    case 'monthly':
      return 'Mensile';
    case 'quarterly':
      return 'Trimestrale';
    case 'annually':
      return 'Annuale';
    default:
      return recurrenceType;
  }
};

export const getPaymentMethodLabel = (paymentMethod: string) => {
  switch (paymentMethod) {
    case 'credit_card':
      return 'Carta di credito';
    case 'paypal':
      return 'PayPal';
    default:
      return paymentMethod;
  }
};

export const getTypeLabel = (type: string) => {
  switch (type) {
    case 'services':
      return 'Servizi';
    case 'entries':
      return 'Ingressi';
    default:
      return type;
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Attivo';
    case 'cancelled':
      return 'Cancellato';
    case 'expired':
      return 'Scaduto';
    default:
      return status;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'cancelled':
      return 'bg-red-500';
    case 'expired':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};
