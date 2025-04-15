
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface MessageComposerStepProps {
  communicationType: 'email' | 'sms' | 'whatsapp';
  subject: string;
  content: string;
  onSubjectChange: (subject: string) => void;
  onContentChange: (content: string) => void;
}

const MessageComposerStep: React.FC<MessageComposerStepProps> = ({
  communicationType,
  subject,
  content,
  onSubjectChange,
  onContentChange
}) => {
  const maxLength = communicationType === 'sms' ? 160 : 2000;
  
  // Placeholder variables that can be used in the message
  const placeholders = [
    { key: '{nome}', description: 'Nome del cliente' },
    { key: '{cognome}', description: 'Cognome del cliente' },
    { key: '{data_appuntamento}', description: 'Data del prossimo appuntamento' },
    { key: '{ora_appuntamento}', description: 'Ora del prossimo appuntamento' },
    { key: '{nome_salone}', description: 'Nome del salone' },
  ];
  
  const handleInsertPlaceholder = (placeholder: string) => {
    onContentChange(content + placeholder);
  };
  
  return (
    <div className="space-y-4">
      {(communicationType === 'email' || communicationType === 'whatsapp') && (
        <div className="space-y-2">
          <Label htmlFor="subject">Oggetto</Label>
          <Input
            id="subject"
            placeholder="Inserisci l'oggetto della comunicazione"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
          />
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="content">Contenuto</Label>
          <span className="text-xs text-muted-foreground">
            {content.length} / {maxLength} caratteri
          </span>
        </div>
        <Textarea
          id="content"
          placeholder={`Inserisci il contenuto del messaggio ${communicationType === 'sms' ? '(max 160 caratteri)' : ''}`}
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="min-h-[200px]"
          maxLength={maxLength}
        />
      </div>
      
      <div className="border-t pt-4">
        <Label className="mb-2 block">Inserisci variabili</Label>
        <div className="flex flex-wrap gap-2">
          {placeholders.map((placeholder) => (
            <button
              key={placeholder.key}
              type="button"
              className="inline-flex items-center text-xs bg-gray-100 hover:bg-gray-200 rounded-md px-2 py-1 transition-colors"
              onClick={() => handleInsertPlaceholder(placeholder.key)}
            >
              {placeholder.key} <span className="ml-2 text-muted-foreground">{placeholder.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageComposerStep;
