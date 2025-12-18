export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';

export interface FlattenedEndpoint {
  id: string;
  name: string;
  method: HttpMethod;
  url: string;
  path: string[];
}

export interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'endpoint';
  method?: HttpMethod;
  url?: string;
  children?: TreeNode[];
}

export interface EnvironmentVariable {
  key: string;
  value: string;
}

export interface Role {
  id: string;
  name: string;
  token: string;
}

export type ScanStatus = 'idle' | 'loading' | 'success' | 'forbidden' | 'error' | 'serverError';

export interface ScanResult {
  endpointId: string;
  roleId: string;
  status: ScanStatus;
  httpStatus?: number;
  errorMessage?: string;
}

export type ResultsMap = Map<string, ScanResult>;
