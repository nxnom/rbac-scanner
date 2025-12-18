import { Button } from '@geckoui/geckoui';
import { useCollection } from '../../context/CollectionContext';

export function TopBar() {
  const { collection, clearCollection } = useCollection();

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h1 className="text-xl font-bold">RBAC Scanner</h1>

      {collection && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCollection}
          className="text-red-500"
        >
          Clear Collection
        </Button>
      )}
    </div>
  );
}
