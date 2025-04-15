
import React from 'react';
import { Grid, Mail, MessageSquare, Star, Users, CalendarDays, Gift, Award, Sparkles } from 'lucide-react';
import { CommunicationTemplateType } from '../types';
import { cn } from '@/lib/utils';

interface TemplateSelectionStepProps {
  communicationType: 'email' | 'sms' | 'whatsapp';
  selectedTemplate: string | null;
  onSelectTemplate: (templateId: string) => void;
}

const TemplateSelectionStep: React.FC<TemplateSelectionStepProps> = ({
  communicationType,
  selectedTemplate,
  onSelectTemplate
}) => {
  // Template definitions
  const templates: Record<string, CommunicationTemplateType[]> = {
    email: [
      {
        id: 'email-welcome',
        name: 'Benvenuto',
        description: 'Messaggio di benvenuto per i nuovi clienti',
        icon: <Users className="h-8 w-8" />,
      },
      {
        id: 'email-appointment',
        name: 'Appuntamento',
        description: 'Promemoria o conferma appuntamento',
        icon: <CalendarDays className="h-8 w-8" />,
      },
      {
        id: 'email-promo',
        name: 'Promozione',
        description: 'Annuncio di promozioni e offerte speciali',
        icon: <Star className="h-8 w-8" />,
      },
      {
        id: 'email-birthday',
        name: 'Compleanno',
        description: 'Auguri di compleanno con offerta speciale',
        icon: <Gift className="h-8 w-8" />,
      },
      {
        id: 'email-newsletter',
        name: 'Newsletter',
        description: 'Aggiornamenti e novità per i tuoi clienti',
        icon: <Mail className="h-8 w-8" />,
      },
      {
        id: 'email-review',
        name: 'Recensione',
        description: 'Richiedi una recensione post-servizio',
        icon: <Award className="h-8 w-8" />,
      },
    ],
    sms: [
      {
        id: 'sms-reminder',
        name: 'Promemoria',
        description: 'Promemoria breve per appuntamenti',
        icon: <CalendarDays className="h-8 w-8" />,
      },
      {
        id: 'sms-promo',
        name: 'Offerta Flash',
        description: 'Promozioni a tempo limitato',
        icon: <Sparkles className="h-8 w-8" />,
      },
      {
        id: 'sms-thanks',
        name: 'Ringraziamento',
        description: 'Messaggio di ringraziamento post-servizio',
        icon: <Award className="h-8 w-8" />,
      },
    ],
    whatsapp: [
      {
        id: 'wa-welcome',
        name: 'Benvenuto',
        description: 'Messaggio di benvenuto personalizzato',
        icon: <Users className="h-8 w-8" />,
      },
      {
        id: 'wa-reminder',
        name: 'Promemoria',
        description: 'Promemoria per appuntamenti con opzione conferma',
        icon: <CalendarDays className="h-8 w-8" />,
      },
      {
        id: 'wa-promo',
        name: 'Promozione',
        description: 'Offerte personalizzate per il cliente',
        icon: <Star className="h-8 w-8" />,
      },
    ],
  };

  const currentTemplates = templates[communicationType] || [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Scegli un modello</h3>
      <p className="text-muted-foreground">
        Seleziona un modello per iniziare a creare la tua comunicazione
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentTemplates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all hover:border-primary",
              selectedTemplate === template.id ? "border-primary bg-primary/5" : ""
            )}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="flex items-center justify-center p-4 mb-3">
              <div className={cn(
                "rounded-full p-2",
                selectedTemplate === template.id ? "text-primary" : "text-muted-foreground"
              )}>
                {template.icon}
              </div>
            </div>
            <h4 className="text-center font-medium mb-1">{template.name}</h4>
            <p className="text-sm text-center text-muted-foreground">
              {template.description}
            </p>
          </div>
        ))}
      </div>
      
      <div className="border-t border-dashed pt-4 mt-6">
        <div
          className="border rounded-lg p-4 cursor-pointer transition-all hover:border-primary flex items-center"
          onClick={() => onSelectTemplate('custom')}
        >
          <div className={cn(
            "rounded-full p-2",
            selectedTemplate === 'custom' ? "text-primary" : "text-muted-foreground"
          )}>
            <Grid className="h-6 w-6" />
          </div>
          <div className="ml-3">
            <h4 className="font-medium">Modello personalizzato</h4>
            <p className="text-sm text-muted-foreground">
              Crea una comunicazione da zero senza utilizzare un template
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelectionStep;
