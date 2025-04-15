
import React from 'react';
import { Navigate } from 'react-router-dom';

// Reindirizza alla pagina principale delle statistiche
const StatisticsIndex: React.FC = () => {
  return <Navigate to="/statistiche/analisi-andamento" replace />;
};

export default StatisticsIndex;
