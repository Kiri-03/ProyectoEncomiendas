"use client";

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/encomienda';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;