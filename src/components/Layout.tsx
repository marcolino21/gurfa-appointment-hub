import React, { useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const { user, loading, currentSalonId, salons } = useAuth();

  useEffect(() => {
    console.log('Layout mount/update:', {
      user: user?.email,
      salons: salons?.length,
      currentSalonId,
      loading,
      hasSalons: Boolean(salons?.length),
    });
  }, [user, salons, currentSalonId, loading]);

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('No authenticated user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Wait for salon initialization if user has salons but none selected
  if (salons && salons.length > 0 && !currentSalonId) {
    console.log('Waiting for salon initialization');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user has no salons, this is an error state
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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
