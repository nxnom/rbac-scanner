import { Button } from '@geckoui/geckoui';
import { useCollection } from '../../context/CollectionContext';
import { CollectionFolder } from './CollectionFolder';
import { EndpointItem } from './EndpointItem';

export function CollectionTree() {
  const { collection, treeNodes, selectAll, deselectAll, selectedIds, endpoints } =
    useCollection();

  if (!collection) {
    return null;
  }

  const allSelected = selectedIds.size === endpoints.length;
  const noneSelected = selectedIds.size === 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 pb-3 border-b">
        <h2 className="font-semibold">{collection.info.name}</h2>
        <div className="flex gap-2">
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
        {treeNodes.map((node) =>
          node.type === 'folder' ? (
            <CollectionFolder key={node.id} node={node} depth={0} />
          ) : (
            <EndpointItem key={node.id} node={node} depth={0} />
          )
        )}
      </div>

      <div className="mt-3 pt-3 border-t text-sm text-gray-500">
        {selectedIds.size} of {endpoints.length} endpoints selected
      </div>
    </div>
  );
}
