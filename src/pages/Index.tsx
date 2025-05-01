import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { user, loading, currentSalonId, salons } = useAuth();

  // Use effect to log authentication state
  useEffect(() => {
    console.log('Index render:', {
      user: user?.email,
      loading,
      salons: salons?.length,
      currentSalonId,
      hasSalons: Boolean(salons?.length),
    });
  }, [user, loading, salons, currentSalonId]);

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log('No authenticated user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If authenticated but no salons, show error
  if (salons && salons.length === 0) {
    console.error('User has no associated salons');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Errore</h1>
          <p className="text-gray-600">Nessun salone associato all'utente.</p>
        </div>
      </div>
    );
  }

  // If authenticated and has salons but no salon selected, wait
  if (salons && salons.length > 0 && !currentSalonId) {
    console.log('Waiting for salon initialization');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If everything is ready, redirect to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
