// admin/components/ProtectedRoute.tsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../../lib/axios';

const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG || "panel-8742";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get('/auth/check');
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div className="text-center p-10">Yükleniyor...</div>;
  }

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to={`/${ADMIN_SLUG}/login`} replace />
  );
};

export default ProtectedRoute;
