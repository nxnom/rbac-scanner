import { createContext, useContext, useState, ReactNode } from 'react';
import type { PostmanCollection } from '../types/postman.types';
import type { FlattenedEndpoint, TreeNode } from '../types/rbac.types';
import {
  parseCollection,
  flattenEndpoints,
  buildTreeStructure,
  getAllEndpointIds,
  getEndpointIdsInFolder,
} from '../utils/postmanParser';

interface CollectionState {
  collection: PostmanCollection | null;
  treeNodes: TreeNode[];
  endpoints: FlattenedEndpoint[];
  selectedIds: Set<string>;
}

interface CollectionContextValue extends CollectionState {
  setCollection: (jsonString: string) => void;
  clearCollection: () => void;
  toggleEndpoint: (id: string) => void;
  toggleFolder: (node: TreeNode) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isSelected: (id: string) => boolean;
  getSelectedEndpoints: () => FlattenedEndpoint[];
}

const CollectionContext = createContext<CollectionContextValue | null>(null);

const initialState: CollectionState = {
  collection: null,
  treeNodes: [],
  endpoints: [],
  selectedIds: new Set(),
};

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CollectionState>(initialState);

  const setCollection = (jsonString: string) => {
    const collection = parseCollection(jsonString);
    const treeNodes = buildTreeStructure(collection.item);
    const endpoints = flattenEndpoints(collection.item);
    const selectedIds = new Set(endpoints.map((e) => e.id));

    setState({ collection, treeNodes, endpoints, selectedIds });
  };

  const clearCollection = () => {
    setState(initialState);
  };

  const toggleEndpoint = (id: string) => {
    setState((prev) => {
      const newSelected = new Set(prev.selectedIds);

      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }

      return { ...prev, selectedIds: newSelected };
    });
  };

  const toggleFolder = (node: TreeNode) => {
    const folderEndpointIds = getEndpointIdsInFolder(node);

    setState((prev) => {
      const newSelected = new Set(prev.selectedIds);
      const allSelected = folderEndpointIds.every((id) => newSelected.has(id));

      if (allSelected) {
        folderEndpointIds.forEach((id) => newSelected.delete(id));
      } else {
        folderEndpointIds.forEach((id) => newSelected.add(id));
      }

      return { ...prev, selectedIds: newSelected };
    });
  };

  const selectAll = () => {
    setState((prev) => ({
      ...prev,
      selectedIds: new Set(getAllEndpointIds(prev.treeNodes)),
    }));
  };

  const deselectAll = () => {
    setState((prev) => ({
      ...prev,
      selectedIds: new Set(),
    }));
  };

  const isSelected = (id: string) => state.selectedIds.has(id);

  const getSelectedEndpoints = () =>
    state.endpoints.filter((e) => state.selectedIds.has(e.id));

  const value: CollectionContextValue = {
    ...state,
    setCollection,
    clearCollection,
    toggleEndpoint,
    toggleFolder,
    selectAll,
    deselectAll,
    isSelected,
    getSelectedEndpoints,
  };

  return (
    <CollectionContext.Provider value={value}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);

  if (!context) {
    throw new Error('useCollection must be used within CollectionProvider');
  }

  return context;
}
