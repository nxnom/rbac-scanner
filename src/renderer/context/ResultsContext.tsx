import { createContext, useContext, useState, useRef, ReactNode } from 'react';
import type { ScanResult, ScanStatus } from '../types/rbac.types';

interface ScanProgress {
  total: number;
  completed: number;
}

interface ResultsState {
  results: Map<string, ScanResult>;
  isScanning: boolean;
  progress: ScanProgress;
}

interface ResultsContextValue extends ResultsState {
  scanId: number;
  setResult: (endpointId: string, roleId: string, result: ScanResult) => void;
  setResultStatus: (endpointId: string, roleId: string, status: ScanStatus) => void;
  getResult: (endpointId: string, roleId: string) => ScanResult | undefined;
  clearResults: () => void;
  setScanning: (value: boolean) => void;
  setProgress: (progress: ScanProgress) => void;
  incrementCompleted: () => void;
  startNewScan: (total: number) => number;
}

const ResultsContext = createContext<ResultsContextValue | null>(null);

function makeKey(endpointId: string, roleId: string): string {
  return `${endpointId}:${roleId}`;
}

const initialState: ResultsState = {
  results: new Map(),
  isScanning: false,
  progress: { total: 0, completed: 0 },
};

export function ResultsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ResultsState>(initialState);
  const scanIdRef = useRef(0);

  const setResult = (endpointId: string, roleId: string, result: ScanResult) => {
    setState((prev) => {
      const newResults = new Map(prev.results);
      newResults.set(makeKey(endpointId, roleId), result);

      return { ...prev, results: newResults };
    });
  };

  const setResultStatus = (endpointId: string, roleId: string, status: ScanStatus) => {
    setState((prev) => {
      const key = makeKey(endpointId, roleId);
      const existing = prev.results.get(key);
      const newResults = new Map(prev.results);

      newResults.set(key, {
        endpointId,
        roleId,
        status,
        httpStatus: existing?.httpStatus,
        errorMessage: existing?.errorMessage,
      });

      return { ...prev, results: newResults };
    });
  };

  const getResult = (endpointId: string, roleId: string) => {
    return state.results.get(makeKey(endpointId, roleId));
  };

  const clearResults = () => {
    setState((prev) => ({
      ...prev,
      results: new Map(),
    }));
  };

  const setScanning = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      isScanning: value,
    }));
  };

  const setProgress = (progress: ScanProgress) => {
    setState((prev) => ({
      ...prev,
      progress,
    }));
  };

  const incrementCompleted = () => {
    setState((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        completed: prev.progress.completed + 1,
      },
    }));
  };

  const startNewScan = (total: number) => {
    scanIdRef.current += 1;
    setState({
      results: new Map(),
      isScanning: true,
      progress: { total, completed: 0 },
    });
    return scanIdRef.current;
  };

  const value: ResultsContextValue = {
    ...state,
    scanId: scanIdRef.current,
    setResult,
    setResultStatus,
    getResult,
    clearResults,
    setScanning,
    setProgress,
    incrementCompleted,
    startNewScan,
  };

  return (
    <ResultsContext.Provider value={value}>
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  const context = useContext(ResultsContext);

  if (!context) {
    throw new Error('useResults must be used within ResultsProvider');
  }

  return context;
}
