
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <p className="text-2xl font-semibold mb-2">Pagina non trovata</p>
        <p className="text-gray-600 mb-6">
          La pagina <span className="font-mono bg-gray-100 px-1 rounded">{location.pathname}</span> non esiste.
        </p>
        <Link to="/">
          <Button>Torna alla dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
