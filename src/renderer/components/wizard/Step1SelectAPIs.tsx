import { Button } from '@geckoui/geckoui';
import { useCollection } from '../../context/CollectionContext';
import { useVariables } from '../../context/VariablesContext';
import { useStep } from '../../context/StepContext';
import { CollectionImport } from '../collection/CollectionImport';
import { CollectionTree } from '../collection/CollectionTree';
import { extractVariablesWithRequired } from '../../utils/variableExtractor';

export function Step1SelectAPIs() {
  const { collection, selectedIds, endpoints } = useCollection();
  const { setVariablesFromExtracted } = useVariables();
  const { nextStep } = useStep();

  const canProceed = selectedIds.size > 0;

  const handleNext = () => {
    const extracted = extractVariablesWithRequired(endpoints);
    setVariablesFromExtracted(extracted);
    nextStep();
  };

  if (!collection) {
    return (
      <div className="flex-1 p-6">
        <CollectionImport />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-auto">
        <CollectionTree />
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {selectedIds.size} of {endpoints.length} endpoints selected
          </span>
          <Button onClick={handleNext} disabled={!canProceed}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
