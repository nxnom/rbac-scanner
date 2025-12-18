import { Input } from '@geckoui/geckoui';
import { useVariables } from '../../context/VariablesContext';
import { classNames } from '../../utils/classNames';

export function VariablesForm() {
  const { variables, updateVariable } = useVariables();

  if (variables.length === 0) {
    return (
      <div>
        <h3 className="font-semibold mb-2">Variables</h3>
        <p className="text-sm text-gray-500">
          No variables detected in the collection URLs.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-4">Variables</h3>

      <div className="space-y-3">
        {variables.map((variable) => (
          <div key={variable.key} className="flex items-center gap-3">
            <label
              className={classNames(
                'w-40 text-sm font-mono truncate',
                variable.isRequired ? 'text-gray-900' : 'text-gray-600'
              )}
              title={`{{${variable.key}}}`}
            >
              {`{{${variable.key}}}`}
              {variable.isRequired && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </label>

            <div className="flex-1">
              <Input
                value={variable.value}
                onChange={(e) => updateVariable(variable.key, e.target.value)}
                placeholder={`Enter ${variable.key}`}
                className={classNames(
                  variable.isRequired && !variable.value.trim() && 'border-red-300'
                )}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        * Required variables (used at the start of URLs)
      </p>
    </div>
  );
}
