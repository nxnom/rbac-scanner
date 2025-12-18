import { useState, useMemo } from 'react';
import { Button, Input } from '@geckoui/geckoui';
import { useCollection } from '../../context/CollectionContext';
import { CollectionFolder } from './CollectionFolder';
import { EndpointItem } from './EndpointItem';
import type { TreeNode } from '../../types/rbac.types';

function filterTreeNodes(nodes: TreeNode[], search: string): TreeNode[] {
  const lowerSearch = search.toLowerCase();

  return nodes
    .map((node) => {
      if (node.type === 'folder') {
        const folderMatches = node.name.toLowerCase().includes(lowerSearch);

        if (folderMatches) {
          return node;
        }

        const filteredChildren = filterTreeNodes(node.children || [], search);

        if (filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }

        return null;
      }

      const nameMatches = node.name.toLowerCase().includes(lowerSearch);
      const urlMatches = node.url?.toLowerCase().includes(lowerSearch);

      if (nameMatches || urlMatches) {
        return node;
      }

      return null;
    })
    .filter((node): node is TreeNode => node !== null);
}

export function CollectionTree() {
  const { collection, treeNodes, selectAll, deselectAll, selectedIds, endpoints } =
    useCollection();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNodes = useMemo(() => {
    if (!searchTerm.trim()) {
      return treeNodes;
    }

    return filterTreeNodes(treeNodes, searchTerm.trim());
  }, [treeNodes, searchTerm]);

  if (!collection) {
    return null;
  }

  const allSelected = selectedIds.size === endpoints.length;
  const noneSelected = selectedIds.size === 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b">
        <h2 className="font-semibold shrink-0">{collection.info.name}</h2>

        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search endpoints..."
          className="max-w-xs"
        />

        <div className="flex gap-2 shrink-0">
          <Button
            variant="outlined"
            size="sm"
            onClick={selectAll}
            disabled={allSelected}
          >
            Select All
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={deselectAll}
            disabled={noneSelected}
          >
            Deselect All
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="min-w-max">
          {filteredNodes.length > 0 ? (
            filteredNodes.map((node) =>
              node.type === 'folder' ? (
                <CollectionFolder key={node.id} node={node} depth={0} />
              ) : (
                <EndpointItem key={node.id} node={node} depth={0} />
              )
            )
          ) : (
            <div className="text-sm text-gray-500 py-4 text-center">
              No endpoints match your search
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
