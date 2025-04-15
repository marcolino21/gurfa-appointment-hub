
import { Navigate, useLocation } from 'react-router-dom';

const WarehouseIndex = () => {
  const location = useLocation();
  
  // If we're at /magazzino, redirect to /magazzino/prodotti
  if (location.pathname === '/magazzino') {
    return <Navigate to="/magazzino/prodotti" replace />;
  }
  
  return null;
};

export default WarehouseIndex;
