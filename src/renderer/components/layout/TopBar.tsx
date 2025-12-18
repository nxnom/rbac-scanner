import { Button } from '@geckoui/geckoui';
import { useVariables } from '../../context/VariablesContext';
import { useCollection } from '../../context/CollectionContext';
import { VariablesDrawer } from '../variables/VariablesDrawer';

export function TopBar() {
  const { variables, openDrawer } = useVariables();
  const { collection, clearCollection } = useCollection();

  const filledCount = variables.filter((v) => v.value.length > 0).length;

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">RBAC Scanner</h1>

        <div className="flex items-center gap-2">
          {variables.length > 0 && (
            <Button variant="outlined" size="sm" onClick={openDrawer}>
              Variables ({filledCount}/{variables.length})
            </Button>
          )}

          {collection && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCollection}
              className="text-red-500"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <VariablesDrawer />
    </>
  );
}
