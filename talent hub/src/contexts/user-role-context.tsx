"use client";

import React, { createContext, useState, useMemo, type Dispatch, type SetStateAction, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';


export type UserRole = 'applicant' | 'recruiter';

interface UserRoleContextType {
  user: User | null;
  role: UserRole;
  setRole: Dispatch<SetStateAction<UserRole>>;
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
}

export const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>('applicant');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({ user, role, setRole, isAuthenticated, setIsAuthenticated, isLoading }), [user, role, isAuthenticated, isLoading]);

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
}
