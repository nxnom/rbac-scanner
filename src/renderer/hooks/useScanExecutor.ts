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

export function useScanExecutor() {
  const { getSelectedEndpoints } = useCollection();
  const { variables } = useVariables();
  const { roles } = useRoles();
  const { setResult, clearResults, setScanning, isScanning } = useResults();

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
  };

  const executeScan = async () => {
    const selectedEndpoints = getSelectedEndpoints();

    if (selectedEndpoints.length === 0) {
      return;
    }

    clearResults();
    setScanning(true);

    const publicRole: Role = { id: PUBLIC_ROLE_ID, name: PUBLIC_ROLE_NAME, token: '' };
    const allRoles = [...roles, publicRole];

    for (let i = 0; i < selectedEndpoints.length; i += MAX_CONCURRENT_ROWS) {
      const batch = selectedEndpoints.slice(i, i + MAX_CONCURRENT_ROWS);
      await Promise.all(batch.map((endpoint) => scanRow(endpoint, allRoles)));
    }

    setScanning(false);
  };

  return { executeScan, isScanning };
}
