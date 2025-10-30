import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../../store/user';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useUserStore((s) => s.user);
  const token = useUserStore((s) => s.accessToken) || localStorage.getItem('vf_access_token');
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
