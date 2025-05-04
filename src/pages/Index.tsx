
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  // Se l'utente è già loggato, reindirizza alla dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Altrimenti reindirizza alla pagina di login
  return <Navigate to="/login" replace />;
};

export default Index;
