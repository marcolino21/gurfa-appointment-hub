
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, CreditCard, Users } from 'lucide-react';
import { Subscription } from '@/types';
import { getPaymentMethodLabel, getRecurrenceLabel, getStatusColor, getStatusLabel, getTypeLabel } from '../utils/subscriptionUtils';

interface SubscriptionsTableProps {
  subscriptions: Subscription[];
  getClientName: (clientId: string) => string;
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscriptionId: string) => void;
}

export const SubscriptionsTable: React.FC<SubscriptionsTableProps> = ({ 
  subscriptions, 
  getClientName, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Prezzo</TableHead>
          <TableHead>Ricorrenza</TableHead>
          <TableHead>Inizio</TableHead>
          <TableHead>Stato</TableHead>
          <TableHead className="text-right">Azioni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.length > 0 ? (
          subscriptions.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>
                {subscription.name}
              </TableCell>
              <TableCell className="flex items-center">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                {getClientName(subscription.clientId)}
              </TableCell>
              <TableCell>{getTypeLabel(subscription.type)}</TableCell>
              <TableCell>€ {subscription.price.toFixed(2)}</TableCell>
              <TableCell className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                {getRecurrenceLabel(subscription.recurrenceType)}
              </TableCell>
              <TableCell>{subscription.startDate}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div 
                    className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(subscription.status)}`} 
                  />
                  {getStatusLabel(subscription.status)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(subscription)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(subscription.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={8} className="text-center">
              Nessun abbonamento disponibile
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
