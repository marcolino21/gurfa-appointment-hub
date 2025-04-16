
import React from 'react';
import { Button } from "@/components/ui/button";
import SubscriptionCard from './SubscriptionCard';

const SubscriptionsList: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Piani Attivi</h3>
      
      <SubscriptionCard
        type="primary"
        title="IT PREMIUM"
        subtitle="SERVIZIO BASE"
        activationDate="30/06/2023"
      />
      
      <SubscriptionCard 
        type="secondary"
        title="Credito SMS"
        subtitle="SERVIZIO AGGIUNTIVO"
        activationDate="10/03/2023"
        available="2375 sms / 3.000"
      />
      
      <SubscriptionCard 
        type="secondary"
        title="Credito Email"
        subtitle="SERVIZIO AGGIUNTIVO"
        activationDate="08/07/2022"
        available="5839 email / 5.866"
      />

      <div className="flex justify-center mt-2">
        <Button variant="outline">AGGIUNGI SERVIZI</Button>
      </div>
    </div>
  );
};

export default SubscriptionsList;
