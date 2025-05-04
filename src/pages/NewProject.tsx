
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NewProject = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // This is just a redirecting page that preserves the URL params
    navigate(`/progetti${location.search}`);
  }, [navigate, location]);
  
  return null;
};

export default NewProject;
