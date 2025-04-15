
import React, { useState } from 'react';
import { useCommunications } from '../hooks/useCommunications';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CommunicationsListProps {
  type: 'all' | 'email' | 'sms' | 'whatsapp';
}

const CommunicationsList: React.FC<CommunicationsListProps> = ({ type }) => {
  const { communications, isLoading } = useCommunications(type);

  if (isLoading) {
    return <div className="flex justify-center py-8">Caricamento comunicazioni...</div>;
  }

  if (communications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Send className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium mb-2">Nessuna comunicazione trovata</h3>
        <p className="text-muted-foreground">
          {type === 'all' 
            ? "Non hai ancora inviato comunicazioni." 
            : `Non hai ancora inviato comunicazioni di tipo ${type}.`}
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Periodo</TableHead>
          <TableHead>Mittente</TableHead>
          <TableHead>Oggetto</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead className="text-center">Destinatari</TableHead>
          <TableHead className="text-center">Aperture</TableHead>
          <TableHead className="text-center">Click</TableHead>
          <TableHead>Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {communications.map((comm) => (
          <TableRow key={comm.id}>
            <TableCell className="font-medium">
              <div className="text-sm">{new Date(comm.sentAt).toLocaleDateString('it-IT')}</div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comm.sentAt), { addSuffix: true, locale: it })}
              </div>
            </TableCell>
            <TableCell>{comm.sender}</TableCell>
            <TableCell>{comm.subject}</TableCell>
            <TableCell>
              <TypeBadge type={comm.type} />
            </TableCell>
            <TableCell className="text-center">{comm.recipientCount}</TableCell>
            <TableCell className="text-center">{comm.openRate}%</TableCell>
            <TableCell className="text-center">{comm.clickRate}%</TableCell>
            <TableCell>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reinvia</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const TypeBadge: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'email':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
        <Mail className="h-3 w-3 mr-1" /> Email
      </Badge>;
    case 'sms':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        <MessageSquare className="h-3 w-3 mr-1" /> SMS
      </Badge>;
    case 'whatsapp':
      return <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
        <MessageSquare className="h-3 w-3 mr-1" /> WhatsApp
      </Badge>;
    default:
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Altro</Badge>;
  }
};

export default CommunicationsList;
