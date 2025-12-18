import { createContext, useContext, useState, ReactNode } from 'react';
import type { EnvironmentVariable } from '../types/rbac.types';

interface VariablesState {
  variables: EnvironmentVariable[];
}

interface VariablesContextValue extends VariablesState {
  setVariablesFromExtracted: (extracted: EnvironmentVariable[]) => void;
  loadVariables: (vars: { key: string; value: string }[]) => void;
  updateVariable: (key: string, value: string) => void;
  clearVariables: () => void;
  areRequiredVariablesFilled: () => boolean;
}

const VariablesContext = createContext<VariablesContextValue | null>(null);

const initialState: VariablesState = {
  variables: [],
};

export function VariablesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VariablesState>(initialState);

  const setVariablesFromExtracted = (extracted: EnvironmentVariable[]) => {
    setState((prev) => {
      const existingValues = new Map(prev.variables.map((v) => [v.key, v.value]));

      const newVariables = extracted.map((v) => ({
        ...v,
        value: existingValues.get(v.key) ?? '',
      }));

      return { ...prev, variables: newVariables };
    });
  };

  const loadVariables = (vars: { key: string; value: string }[]) => {
    setState((prev) => {
      const loadedValues = new Map(vars.map((v) => [v.key, v.value]));

      const newVariables = prev.variables.map((v) => ({
        ...v,
        value: loadedValues.get(v.key) ?? v.value,
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

  const clearVariables = () => {
    setState(initialState);
  };

  const areRequiredVariablesFilled = () => {
    return state.variables
      .filter((v) => v.isRequired)
      .every((v) => v.value.trim().length > 0);
  };

  const value: VariablesContextValue = {
    ...state,
    setVariablesFromExtracted,
    loadVariables,
    updateVariable,
    clearVariables,
    areRequiredVariablesFilled,
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
