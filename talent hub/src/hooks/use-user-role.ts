"use client";

import { useContext } from 'react';
import { UserRoleContext } from '@/contexts/user-role-context';

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
}
