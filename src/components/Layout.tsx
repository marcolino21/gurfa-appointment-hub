import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const { user, loading, currentSalonId, salons } = useAuth();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkSession = () => {
      if (!loading) {
        if (!user) {
          console.log('No user found, redirecting to login...');
          navigate('/login', { replace: true });
        } else {
          setIsInitialized(true);
        }
      }
    };

    checkSession();
  }, [user, loading, navigate]);

  // Show loading spinner while authentication state is being determined
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Inizializzazione salone...</p>
        </div>
      </div>
    );
  }

  // If user has no salons, show error state
  if (salons && salons.length === 0) {
    console.error('User has no associated salons');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Errore</h1>
          <p className="text-gray-600">Nessun salone associato all'utente.</p>
          <p className="text-sm text-gray-500 mt-2">Contatta l'amministratore per risolvere il problema.</p>
          <button 
            onClick={() => {
              localStorage.clear();
              navigate('/login', { replace: true });
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Torna al login
          </button>
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
