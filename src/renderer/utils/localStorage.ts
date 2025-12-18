import type { SavedEnvironment } from '../types/rbac.types';

const STORAGE_KEY = 'rbac-scanner-environments';

export function loadEnvironments(): SavedEnvironment[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    return JSON.parse(data) as SavedEnvironment[];
  } catch {
    return [];
  }
}

export function saveEnvironment(env: SavedEnvironment): void {
  const environments = loadEnvironments();
  const existingIndex = environments.findIndex((e) => e.name === env.name);

  if (existingIndex >= 0) {
    environments[existingIndex] = env;
  } else {
    environments.push(env);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(environments));
}

export function deleteEnvironment(name: string): void {
  const environments = loadEnvironments();
  const filtered = environments.filter((e) => e.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function getEnvironment(name: string): SavedEnvironment | undefined {
  const environments = loadEnvironments();
  return environments.find((e) => e.name === name);
}
