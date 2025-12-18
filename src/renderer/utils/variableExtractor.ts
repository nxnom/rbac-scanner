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

export function extractAllVariables(endpoints: FlattenedEndpoint[]): string[] {
  const allVariables = new Set<string>();

  for (const endpoint of endpoints) {
    const vars = extractVariables(endpoint.url);
    vars.forEach((v) => allVariables.add(v));
  }

  return Array.from(allVariables);
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
