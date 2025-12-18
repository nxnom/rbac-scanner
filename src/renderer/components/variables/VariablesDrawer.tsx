import { Drawer, Input, Button } from '@geckoui/geckoui';
import { useVariables } from '../../context/VariablesContext';

export function VariablesDrawer() {
  const { variables, drawerOpen, closeDrawer, updateVariable } = useVariables();

  return (
    <Drawer
      open={drawerOpen}
      handleClose={closeDrawer}
      placement="right"
      allowClickOutside
    >
      <div className="w-80 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Environment Variables</h2>
          <Button variant="ghost" size="sm" onClick={closeDrawer}>
            ✕
          </Button>
        </div>

        {variables.length === 0 ? (
          <p className="text-sm text-gray-500">
            No variables detected in the collection URLs.
          </p>
        ) : (
          <div className="space-y-3">
            {variables.map((variable) => (
              <div key={variable.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {`{{${variable.key}}}`}
                </label>
                <Input
                  value={variable.value}
                  onChange={(e) => updateVariable(variable.key, e.target.value)}
                  placeholder={`Enter value for ${variable.key}`}
                />
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">
          Variables are replaced in endpoint URLs before making requests.
        </p>
      </div>
    </Drawer>
  );
}
