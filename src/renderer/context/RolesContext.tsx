import { createContext, useContext, useState, ReactNode } from 'react';
import type { Role } from '../types/rbac.types';

interface RolesState {
  roles: Role[];
}

interface RolesContextValue extends RolesState {
  addRole: (name: string, token: string) => void;
  removeRole: (id: string) => void;
  updateRole: (id: string, name: string, token: string) => void;
  clearRoles: () => void;
}

const RolesContext = createContext<RolesContextValue | null>(null);

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

const initialState: RolesState = {
  roles: [],
};

export function RolesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RolesState>(initialState);

  const addRole = (name: string, token: string) => {
    const newRole: Role = {
      id: generateId(),
      name,
      token,
    };

    setState((prev) => ({
      ...prev,
      roles: [...prev.roles, newRole],
    }));
  };

  const removeRole = (id: string) => {
    setState((prev) => ({
      ...prev,
      roles: prev.roles.filter((r) => r.id !== id),
    }));
  };

  const updateRole = (id: string, name: string, token: string) => {
    setState((prev) => ({
      ...prev,
      roles: prev.roles.map((r) =>
        r.id === id ? { ...r, name, token } : r
      ),
    }));
  };

  const clearRoles = () => {
    setState(initialState);
  };

  const value: RolesContextValue = {
    ...state,
    addRole,
    removeRole,
    updateRole,
    clearRoles,
  };

  return (
    <RolesContext.Provider value={value}>
      {children}
    </RolesContext.Provider>
  );
}

export function useRoles() {
  const context = useContext(RolesContext);

  if (!context) {
    throw new Error('useRoles must be used within RolesProvider');
  }

  return context;
}
