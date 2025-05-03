import React from 'react';

export interface Communication {
  id: string;
  type: 'email' | 'sms' | 'whatsapp';
  sender: string;
  subject: string;
  content: string;
  recipientCount: number;
  openRate: number;
  clickRate: number;
  sentAt: string;
  salonId: string;
}

export interface CommunicationTemplateType {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
}

export interface CreditPackage {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'sms' | 'whatsapp';
  credits: number;
  price: number;
  discount?: number;
}

export interface CommunicationRecipient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  hasWhatsapp?: boolean;
}
