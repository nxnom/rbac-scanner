export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'] as const;

export const FORBIDDEN_STATUSES = [401, 403];
export const ERROR_STATUSES = [405];
export const SERVER_ERROR_STATUSES = [500];

export const PUBLIC_ROLE_ID = 'public';
export const PUBLIC_ROLE_NAME = 'Public';

export const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-100 text-green-700',
  POST: 'bg-blue-100 text-blue-700',
  PUT: 'bg-yellow-100 text-yellow-700',
  PATCH: 'bg-orange-100 text-orange-700',
  DELETE: 'bg-red-100 text-red-700',
  HEAD: 'bg-purple-100 text-purple-700',
  OPTIONS: 'bg-gray-100 text-gray-700',
};
