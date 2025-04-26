
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  // Use effect to log authentication state
  useEffect(() => {
    if (user) {
      console.log('User authenticated, redirecting to dashboard');
    } else {
      console.log('No authenticated user found, redirecting to login');
    }
  }, [user]);

  // Se l'utente è già loggato, reindirizza alla dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Altrimenti reindirizza alla pagina di login
  return <Navigate to="/login" replace />;
};

export default Index;
