import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole } from '@/types/encomienda';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  userRole: UserRole;
}

const RoleGuard = ({ children, allowedRoles, userRole }: RoleGuardProps) => {
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
};

export default RoleGuard;