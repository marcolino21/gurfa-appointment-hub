
import React from 'react';
import { Button } from "@/components/ui/button";

interface UserActionsProps {
  onAddUser: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({ onAddUser }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Utenti attivi</h2>
      <Button onClick={onAddUser}>AGGIUNGI UTENTE</Button>
    </div>
  );
};

export default UserActions;
