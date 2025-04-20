import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useClientsData } from "@/features/clients/hooks/useClientsData";
import ClientSelectionStep from './ClientSelectionStep';
import MessageComposerStep from './MessageComposerStep';
import TemplateSelectionStep from './TemplateSelectionStep';
import CreditStatus from './CreditStatus';

interface NewCommunicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewCommunicationDialog: React.FC<NewCommunicationDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [step, setStep] = useState<'template' | 'recipients' | 'compose' | 'review'>('template');
  const [communicationType, setCommunicationType] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  
  const { toast } = useToast();
  const { clients } = useClientsData();

  const handleNextStep = () => {
    if (step === 'template') {
      if (!selectedTemplate) {
        toast({
          title: "Errore",
          description: "Seleziona un modello per continuare",
          variant: "destructive",
        });
        return;
      }
      setStep('recipients');
    } else if (step === 'recipients') {
      if (selectedClients.length === 0) {
        toast({
          title: "Errore",
          description: "Seleziona almeno un destinatario per continuare",
          variant: "destructive",
        });
        return;
      }
      setStep('compose');
    } else if (step === 'compose') {
      if (!subject.trim() || !content.trim()) {
        toast({
          title: "Errore",
          description: "Compila tutti i campi per continuare",
          variant: "destructive",
        });
        return;
      }
      setStep('review');
    }
  };

  const handlePreviousStep = () => {
    if (step === 'recipients') setStep('template');
    else if (step === 'compose') setStep('recipients');
    else if (step === 'review') setStep('compose');
  };

  const handleSend = () => {
    toast({
      title: "Comunicazione inviata",
      description: `La tua comunicazione è stata inviata a ${selectedClients.length} destinatari.`,
    });
    
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setStep('template');
    setSelectedTemplate(null);
    setSelectedClients([]);
    setSubject('');
    setContent('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-[95%] max-h-[90vh] overflow-y-auto p-4 md:p-6">
        <DialogHeader>
          <DialogTitle>Nuova Comunicazione</DialogTitle>
          <DialogDescription>
            Crea e invia una nuova comunicazione ai tuoi clienti
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <CreditStatus />
        </div>

        <Tabs value={communicationType} onValueChange={(value) => setCommunicationType(value as any)} className="mb-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="sms">SMS</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          </TabsList>
        </Tabs>

        {step === 'template' && (
          <TemplateSelectionStep 
            communicationType={communicationType}
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
          />
        )}

        {step === 'recipients' && (
          <ClientSelectionStep 
            selectedClients={selectedClients}
            onSelectClients={setSelectedClients}
            communicationType={communicationType}
          />
        )}

        {step === 'compose' && (
          <MessageComposerStep 
            communicationType={communicationType}
            subject={subject}
            content={content}
            onSubjectChange={setSubject}
            onContentChange={setContent}
          />
        )}

        {step === 'review' && (
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <div className="font-medium mb-2">Riepilogo comunicazione</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Tipo</Label>
                  <div className="font-medium">{communicationType === 'email' ? 'Email' : communicationType === 'sms' ? 'SMS' : 'WhatsApp'}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Destinatari</Label>
                  <div className="font-medium">{selectedClients.length} clienti</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Oggetto</Label>
                  <div className="font-medium">{subject}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Modello utilizzato</Label>
                  <div className="font-medium">{selectedTemplate}</div>
                </div>
              </div>
            </div>
            
            <div className="rounded-md border p-4">
              <div className="font-medium mb-2">Anteprima contenuto</div>
              <div className="whitespace-pre-wrap border rounded-md p-4 bg-gray-50">
                {content}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          {step !== 'template' ? (
            <Button variant="outline" onClick={handlePreviousStep}>Indietro</Button>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>Annulla</Button>
          )}
          
          {step !== 'review' ? (
            <Button onClick={handleNextStep}>Avanti</Button>
          ) : (
            <Button onClick={handleSend}>Invia Comunicazione</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewCommunicationDialog;
