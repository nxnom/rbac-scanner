import { useState } from 'react';
import { Checkbox } from '@geckoui/geckoui';
import { useCollection } from '../../context/CollectionContext';
import { getEndpointIdsInFolder } from '../../utils/postmanParser';
import type { TreeNode } from '../../types/rbac.types';
import { EndpointItem } from './EndpointItem';
import { classNames } from '../../utils/classNames';

interface CollectionFolderProps {
  node: TreeNode;
  depth: number;
}

export function CollectionFolder({ node, depth }: CollectionFolderProps) {
  const [expanded, setExpanded] = useState(true);
  const { isSelected, toggleFolder } = useCollection();

  const endpointIds = getEndpointIdsInFolder(node);
  const selectedCount = endpointIds.filter(isSelected).length;
  const allSelected = endpointIds.length > 0 && selectedCount === endpointIds.length;
  const someSelected = selectedCount > 0 && selectedCount < endpointIds.length;

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleCheckChange = () => {
    toggleFolder(node);
  };

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
      >
        <Checkbox
          checked={allSelected || someSelected}
          partial={someSelected}
          onChange={handleCheckChange}
        />

        <button
          onClick={handleToggle}
          className="flex items-center gap-1 flex-1 text-left"
        >
          <span
            className={classNames(
              'text-gray-400 transition-transform',
              expanded && 'rotate-90'
            )}
          >
            ▶
          </span>
          <span className="text-sm font-medium">{node.name}</span>
          <span className="text-xs text-gray-400">
            ({selectedCount}/{endpointIds.length})
          </span>
        </button>
      </div>

      {expanded && node.children && (
        <div>
          {node.children.map((child) =>
            child.type === 'folder' ? (
              <CollectionFolder key={child.id} node={child} depth={depth + 1} />
            ) : (
              <EndpointItem key={child.id} node={child} depth={depth + 1} />
            )
          )}
        </div>
      )}
    </div>
  );
}
