import { Checkbox } from '@geckoui/geckoui';
import { useCollection } from '../../context/CollectionContext';
import { METHOD_COLORS } from '../../constants/constants';
import type { TreeNode } from '../../types/rbac.types';
import { classNames } from '../../utils/classNames';

interface EndpointItemProps {
  node: TreeNode;
  depth: number;
}

export function EndpointItem({ node, depth }: EndpointItemProps) {
  const { isSelected, toggleEndpoint } = useCollection();
  const selected = isSelected(node.id);

  const handleChange = () => {
    toggleEndpoint(node.id);
  };

  const methodColor = node.method ? METHOD_COLORS[node.method] : '';

  return (
    <div
      className="flex items-center gap-2 py-1.5 hover:bg-gray-50 rounded"
      style={{ paddingLeft: `${depth * 20 + 8}px` }}
    >
      <Checkbox checked={selected} onChange={handleChange} />

      {node.method && (
        <span
          className={classNames(
            'text-xs font-medium px-1.5 py-0.5 rounded',
            methodColor
          )}
        >
          {node.method}
        </span>
      )}

      <span className="text-sm truncate flex-1">{node.name}</span>

      {node.url && (
        <span className="text-xs text-gray-400 truncate max-w-48">
          {node.url}
        </span>
      )}
    </div>
  );
}
