import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import type { SavedEnvironment } from '../types/rbac.types';
import {
  loadEnvironments,
  saveEnvironment as saveToStorage,
  deleteEnvironment as deleteFromStorage,
  getEnvironment,
} from '../utils/localStorage';
import { useVariables } from './VariablesContext';
import { useRoles } from './RolesContext';

interface EnvironmentContextValue {
  environments: SavedEnvironment[];
  currentEnvironmentName: string;
  isSaved: boolean;
  setCurrentEnvironmentName: (name: string) => void;
  saveCurrentEnvironment: () => void;
  loadEnvironment: (name: string) => void;
  deleteEnvironment: (name: string) => void;
  refreshEnvironments: () => void;
}

const EnvironmentContext = createContext<EnvironmentContextValue | null>(null);

export function EnvironmentProvider({ children }: { children: ReactNode }) {
  const [environments, setEnvironments] = useState<SavedEnvironment[]>([]);
  const [currentEnvironmentName, setCurrentEnvironmentName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const isLoadingRef = useRef(false);
  const { variables, loadVariables } = useVariables();
  const { roles, addRole, clearRoles } = useRoles();

  const refreshEnvironments = () => {
    setEnvironments(loadEnvironments());
  };

  useEffect(() => {
    refreshEnvironments();
  }, []);

  const saveCurrentEnvironment = () => {
    if (!currentEnvironmentName.trim()) {
      return;
    }

    const env: SavedEnvironment = {
      name: currentEnvironmentName.trim(),
      variables: variables.map((v) => ({ key: v.key, value: v.value })),
      roles: roles.map((r) => ({ name: r.name, token: r.token })),
      savedAt: Date.now(),
    };

    saveToStorage(env);
    refreshEnvironments();
    setIsSaved(true);
  };

  useEffect(() => {
    if (!isSaved || !currentEnvironmentName.trim() || isLoadingRef.current) {
      return;
    }

    const env: SavedEnvironment = {
      name: currentEnvironmentName.trim(),
      variables: variables.map((v) => ({ key: v.key, value: v.value })),
      roles: roles.map((r) => ({ name: r.name, token: r.token })),
      savedAt: Date.now(),
    };

    saveToStorage(env);
    refreshEnvironments();
  }, [variables, roles, isSaved, currentEnvironmentName]);

  const loadEnv = (name: string) => {
    const env = getEnvironment(name);

    if (!env) {
      return;
    }

    isLoadingRef.current = true;
    setCurrentEnvironmentName(name);
    loadVariables(env.variables);

    clearRoles();
    env.roles.forEach((r) => addRole(r.name, r.token));
    setIsSaved(true);

    setTimeout(() => {
      isLoadingRef.current = false;
    }, 100);
  };

  const deleteEnv = (name: string) => {
    deleteFromStorage(name);
    refreshEnvironments();

    if (currentEnvironmentName === name) {
      setCurrentEnvironmentName('');
    }
  };

  const value: EnvironmentContextValue = {
    environments,
    currentEnvironmentName,
    isSaved,
    setCurrentEnvironmentName,
    saveCurrentEnvironment,
    loadEnvironment: loadEnv,
    deleteEnvironment: deleteEnv,
    refreshEnvironments,
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  const context = useContext(EnvironmentContext);

  if (!context) {
    throw new Error('useEnvironment must be used within EnvironmentProvider');
  }

  return context;
}
