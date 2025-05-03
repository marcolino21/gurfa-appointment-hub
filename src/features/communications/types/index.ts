
import React from 'react';

export interface CommunicationTemplate {
  id: string;
  title: string;
  content: string;
  type: 'sms' | 'email';
  previewText?: string;
}

export interface EmailTemplate extends CommunicationTemplate {
  type: 'email';
  subject: string;
  htmlContent: React.ReactNode;
}

export interface SmsTemplate extends CommunicationTemplate {
  type: 'sms';
}

export type TemplateType = 'sms' | 'email';

export interface CommunicationStats {
  totalSent: number;
  delivered: number;
  opened: number;
  clicked: number;
}

export interface CreditPackage {
  id: string;
  name: string;
  creditsAmount: number;
  price: number;
  isPopular?: boolean;
}

export interface CurrentCredits {
  availableCredits: number;
  usedCredits: number;
  creditsHistory: CreditHistoryEntry[];
}

export interface CreditHistoryEntry {
  date: Date;
  action: 'purchase' | 'usage';
  amount: number;
  description: string;
}

export interface Communication {
  id: string;
  title: string;
  content: string;
  type: 'sms' | 'email';
  recipients: number;
  sentDate: Date;
  status: 'draft' | 'sent' | 'failed' | 'scheduled';
  scheduledDate?: Date;
  stats?: CommunicationStats;
}
