import { createContext, useContext, useState, ReactNode } from 'react';
import type { EnvironmentVariable } from '../types/rbac.types';

interface VariablesState {
  variables: EnvironmentVariable[];
  drawerOpen: boolean;
}

interface VariablesContextValue extends VariablesState {
  setVariables: (keys: string[]) => void;
  updateVariable: (key: string, value: string) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  clearVariables: () => void;
}

const VariablesContext = createContext<VariablesContextValue | null>(null);

const initialState: VariablesState = {
  variables: [],
  drawerOpen: false,
};

export function VariablesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VariablesState>(initialState);

  const setVariables = (keys: string[]) => {
    setState((prev) => {
      const existingValues = new Map(prev.variables.map((v) => [v.key, v.value]));
      const newVariables = keys.map((key) => ({
        key,
        value: existingValues.get(key) ?? '',
      }));

      return { ...prev, variables: newVariables };
    });
  };

  const updateVariable = (key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      variables: prev.variables.map((v) =>
        v.key === key ? { ...v, value } : v
      ),
    }));
  };

  const openDrawer = () => {
    setState((prev) => ({ ...prev, drawerOpen: true }));
  };

  const closeDrawer = () => {
    setState((prev) => ({ ...prev, drawerOpen: false }));
  };

  const clearVariables = () => {
    setState(initialState);
  };

  const value: VariablesContextValue = {
    ...state,
    setVariables,
    updateVariable,
    openDrawer,
    closeDrawer,
    clearVariables,
  };

  return (
    <VariablesContext.Provider value={value}>
      {children}
    </VariablesContext.Provider>
  );
}

export function useVariables() {
  const context = useContext(VariablesContext);

  if (!context) {
    throw new Error('useVariables must be used within VariablesProvider');
  }

  return context;
}
