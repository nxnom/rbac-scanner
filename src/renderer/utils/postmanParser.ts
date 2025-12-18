import type { PostmanCollection, PostmanItem, PostmanUrl } from '../types/postman.types';
import type { FlattenedEndpoint, HttpMethod, TreeNode } from '../types/rbac.types';

export function parseCollection(jsonString: string): PostmanCollection {
  const collection = JSON.parse(jsonString) as PostmanCollection;
  assignIds(collection.item);
  return collection;
}

function getRawUrl(url: PostmanUrl | string | undefined): string {
  if (!url) {
    return '';
  }

  if (typeof url === 'string') {
    return url;
  }

  return url.raw ?? '';
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function assignIds(items: PostmanItem[]): void {
  for (const item of items) {
    if (!item.id) {
      item.id = generateId();
    }

    if (item.item) {
      assignIds(item.item);
    }
  }
}

export function flattenEndpoints(
  items: PostmanItem[],
  path: string[] = []
): FlattenedEndpoint[] {
  const endpoints: FlattenedEndpoint[] = [];

  for (const item of items) {
    if (item.request?.url) {
      endpoints.push({
        id: item.id ?? generateId(),
        name: item.name,
        method: (item.request.method?.toUpperCase() || 'GET') as HttpMethod,
        url: getRawUrl(item.request.url),
        path: [...path, item.name],
      });
    }

    if (item.item) {
      endpoints.push(...flattenEndpoints(item.item, [...path, item.name]));
    }
  }

  return endpoints;
}

export function buildTreeStructure(items: PostmanItem[]): TreeNode[] {
  return items.map((item) => {
    const { request, item: children } = item;
    const hasValidRequest = request?.url;
    const hasChildren = children && children.length > 0;

    if (hasValidRequest && !hasChildren) {
      return {
        id: item.id ?? generateId(),
        name: item.name,
        type: 'endpoint' as const,
        method: (request.method?.toUpperCase() || 'GET') as HttpMethod,
        url: getRawUrl(request.url),
      };
    }

    if (hasChildren) {
      return {
        id: item.id ?? generateId(),
        name: item.name,
        type: 'folder' as const,
        children: buildTreeStructure(children),
      };
    }

    return {
      id: item.id ?? generateId(),
      name: item.name,
      type: 'endpoint' as const,
      method: (request?.method?.toUpperCase() || 'GET') as HttpMethod,
      url: getRawUrl(request?.url),
    };
  });
}

export function getAllEndpointIds(nodes: TreeNode[]): string[] {
  const ids: string[] = [];

  for (const node of nodes) {
    if (node.type === 'endpoint') {
      ids.push(node.id);
    }

    if (node.children) {
      ids.push(...getAllEndpointIds(node.children));
    }
  }

  return ids;
}

export function getEndpointIdsInFolder(node: TreeNode): string[] {
  if (node.type === 'endpoint') {
    return [node.id];
  }

  if (!node.children) {
    return [];
  }

  return node.children.flatMap(getEndpointIdsInFolder);
}
