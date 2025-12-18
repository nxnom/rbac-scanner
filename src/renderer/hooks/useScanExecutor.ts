import { useRef, useState } from 'react';
import { useCollection } from '../context/CollectionContext';
import { useVariables } from '../context/VariablesContext';
import { useRoles } from '../context/RolesContext';
import { useResults } from '../context/ResultsContext';
import { replaceVariables } from '../utils/variableExtractor';
import {
  FORBIDDEN_STATUSES,
  ERROR_STATUSES,
  SERVER_ERROR_STATUSES,
  PUBLIC_ROLE_ID,
  PUBLIC_ROLE_NAME,
} from '../constants/constants';
import type { ScanStatus, Role, FlattenedEndpoint } from '../types/rbac.types';

const MAX_CONCURRENT_ROWS = 4;

interface ScanProgress {
  total: number;
  completed: number;
}

export function useScanExecutor() {
  const { getSelectedEndpoints } = useCollection();
  const { variables } = useVariables();
  const { roles } = useRoles();
  const { setResult, clearResults, setScanning, isScanning } = useResults();

  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState<ScanProgress>({ total: 0, completed: 0 });

  const pausedRef = useRef(false);
  const scannedIdsRef = useRef<Set<string>>(new Set());
  const pendingEndpointsRef = useRef<FlattenedEndpoint[]>([]);

  const scanEndpoint = async (endpoint: FlattenedEndpoint, role: Role) => {
    const url = replaceVariables(endpoint.url, variables);

    try {
      const headers: HeadersInit = {};

      if (role.token) {
        headers['Authorization'] = `Bearer ${role.token}`;
      }

      const response = await fetch(url, {
        method: endpoint.method,
        headers,
        redirect: 'manual',
      });

      let status: ScanStatus = 'success';

      if (FORBIDDEN_STATUSES.includes(response.status)) {
        status = 'forbidden';
      } else if (ERROR_STATUSES.includes(response.status)) {
        status = 'error';
      } else if (SERVER_ERROR_STATUSES.includes(response.status)) {
        status = 'serverError';
      }

      setResult(endpoint.id, role.id, {
        endpointId: endpoint.id,
        roleId: role.id,
        status,
        httpStatus: response.status,
      });
    } catch (error) {
      setResult(endpoint.id, role.id, {
        endpointId: endpoint.id,
        roleId: role.id,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  const scanRow = async (endpoint: FlattenedEndpoint, allRoles: Role[]) => {
    for (const role of allRoles) {
      setResult(endpoint.id, role.id, {
        endpointId: endpoint.id,
        roleId: role.id,
        status: 'loading',
      });
    }

    await Promise.all(allRoles.map((role) => scanEndpoint(endpoint, role)));
    scannedIdsRef.current.add(endpoint.id);
    setProgress((prev) => ({ ...prev, completed: prev.completed + 1 }));
  };

  const runScanLoop = async (endpoints: FlattenedEndpoint[], allRoles: Role[]) => {
    for (let i = 0; i < endpoints.length; i += MAX_CONCURRENT_ROWS) {
      if (pausedRef.current) {
        pendingEndpointsRef.current = endpoints.slice(i);
        return;
      }

      const batch = endpoints.slice(i, i + MAX_CONCURRENT_ROWS);
      await Promise.all(batch.map((endpoint) => scanRow(endpoint, allRoles)));
    }

    pendingEndpointsRef.current = [];
    setScanning(false);
  };

  const startScan = () => {
    const selectedEndpoints = getSelectedEndpoints();

    if (selectedEndpoints.length === 0) {
      return;
    }

    pausedRef.current = false;
    setIsPaused(false);

    const publicRole: Role = { id: PUBLIC_ROLE_ID, name: PUBLIC_ROLE_NAME, token: '' };
    const allRoles = [...roles, publicRole];

    clearResults();
    scannedIdsRef.current = new Set();
    pendingEndpointsRef.current = [];
    setProgress({ total: selectedEndpoints.length, completed: 0 });
    setScanning(true);

    runScanLoop(selectedEndpoints, allRoles);
  };

  const pauseScan = () => {
    pausedRef.current = true;
    setIsPaused(true);
  };

  return {
    startScan,
    pauseScan,
    isScanning,
    isPaused,
    progress,
  };
}
