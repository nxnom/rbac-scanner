import { Checkbox } from '@geckoui/geckoui';
import { useCollection } from '../../context/CollectionContext';
import { METHOD_COLORS } from '../../constants/constants';
import type { TreeNode } from '../../types/rbac.types';
import { classNames } from '../../utils/classNames';
import { extractPathFromUrl } from '../../utils/variableExtractor';

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
  const displayPath = node.url ? extractPathFromUrl(node.url) : '';

  return (
    <div
      className="flex items-center gap-2 py-1.5 hover:bg-gray-50 rounded"
      style={{ paddingLeft: `${depth * 20 + 8}px` }}
    >
      <Checkbox checked={selected} onChange={handleChange} />

      {node.method && (
        <span
          className={classNames(
            'text-xs font-medium px-1.5 py-0.5 rounded shrink-0',
            methodColor
          )}
        >
          {node.method}
        </span>
      )}

      <span className="text-sm whitespace-nowrap">{node.name}</span>

      {displayPath && (
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {displayPath}
        </span>
      )}
    </div>
  );
}
