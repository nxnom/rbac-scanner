import { Button, Input, Select } from '@geckoui/geckoui';
import { useStep } from '../../context/StepContext';
import { useVariables } from '../../context/VariablesContext';
import { useEnvironment } from '../../context/EnvironmentContext';
import { RolesPanel } from '../roles/RolesPanel';
import { VariablesForm } from '../variables/VariablesForm';

export function Step2Configure() {
  const { prevStep, nextStep } = useStep();
  const { areRequiredVariablesFilled } = useVariables();
  const {
    environments,
    currentEnvironmentName,
    isSaved,
    setCurrentEnvironmentName,
    saveCurrentEnvironment,
    loadEnvironment,
  } = useEnvironment();

  const canRunScan = areRequiredVariablesFilled();

  const environmentOptions = [
    { label: 'New Environment', value: '' },
    ...environments.map((e) => ({ label: e.name, value: e.name })),
  ];

  const handleEnvironmentChange = (value: string | string[]) => {
    const selected = Array.isArray(value) ? value[0] : value;

    if (selected) {
      loadEnvironment(selected);
    } else {
      setCurrentEnvironmentName('');
    }
  };

  const handleRunScan = () => {
    nextStep();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold">Environment</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Environment Name
                </label>
                <div className="flex gap-2">
                  <Input
                    value={currentEnvironmentName}
                    onChange={(e) => setCurrentEnvironmentName(e.target.value)}
                    placeholder="Enter name to save"
                  />
                  <Button
                    variant="outlined"
                    onClick={saveCurrentEnvironment}
                    disabled={!currentEnvironmentName.trim() || isSaved}
                  >
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Load Existing
                </label>
                <Select
                  value={currentEnvironmentName}
                  onChange={handleEnvironmentChange}
                  options={environmentOptions}
                  placeholder="Select environment"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <VariablesForm />
          </div>

          <div className="bg-white border rounded-lg p-4">
            <RolesPanel />
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button variant="outlined" onClick={prevStep}>
            Back
          </Button>

          <div className="flex items-center gap-2">
            {!canRunScan && (
              <span className="text-sm text-red-500">
                Fill all required variables
              </span>
            )}
            <Button onClick={handleRunScan} disabled={!canRunScan}>
              Run Scan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
