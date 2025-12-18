import type { FlattenedEndpoint, EnvironmentVariable } from '../types/rbac.types';

const VARIABLE_REGEX = /\{\{([^}]+)\}\}/g;

export function extractVariables(url: string): string[] {
  const variables: string[] = [];
  let match;

  while ((match = VARIABLE_REGEX.exec(url)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }

  VARIABLE_REGEX.lastIndex = 0;

  return variables;
}

export function isVariableRequired(url: string, variableKey: string): boolean {
  const trimmed = url.trimStart();
  return trimmed.startsWith(`{{${variableKey}}}`);
}

export function extractAllVariables(endpoints: FlattenedEndpoint[]): string[] {
  const allVariables = new Set<string>();

  for (const endpoint of endpoints) {
    const vars = extractVariables(endpoint.url);
    vars.forEach((v) => allVariables.add(v));
  }

  return Array.from(allVariables);
}

export function extractVariablesWithRequired(
  endpoints: FlattenedEndpoint[]
): EnvironmentVariable[] {
  const variableMap = new Map<string, boolean>();

  for (const endpoint of endpoints) {
    const vars = extractVariables(endpoint.url);

    for (const v of vars) {
      const isRequired = isVariableRequired(endpoint.url, v);
      const existing = variableMap.get(v);

      if (existing === undefined || isRequired) {
        variableMap.set(v, isRequired || existing || false);
      }
    }
  }

  return Array.from(variableMap.entries()).map(([key, isRequired]) => ({
    key,
    value: '',
    isRequired,
  }));
}

export function replaceVariables(
  url: string,
  variables: EnvironmentVariable[]
): string {
  let result = url;

  for (const variable of variables) {
    const pattern = new RegExp(`\\{\\{${variable.key}\\}\\}`, 'g');
    result = result.replace(pattern, variable.value);
  }

  return result;
}

export function extractPathFromUrl(url: string): string {
  let cleanUrl = url.trim();

  if (cleanUrl.startsWith('{{')) {
    const endIndex = cleanUrl.indexOf('}}');

    if (endIndex !== -1) {
      cleanUrl = cleanUrl.slice(endIndex + 2);
    }
  }

  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    try {
      const urlObj = new URL(cleanUrl);
      return urlObj.pathname + urlObj.search;
    } catch {
      const match = cleanUrl.match(/^https?:\/\/[^/]+(.*)/);
      return match?.[1] || cleanUrl;
    }
  }

  if (!cleanUrl.startsWith('/') && cleanUrl.length > 0) {
    return '/' + cleanUrl;
  }

  return cleanUrl || '/';
}
