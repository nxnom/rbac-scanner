import { Button } from '@geckoui/geckoui';
import { useCollection } from '../../context/CollectionContext';
import { useStep, Step } from '../../context/StepContext';
import { classNames } from '../../utils/classNames';

const STEPS: { step: Step; label: string }[] = [
  { step: 1, label: 'Select APIs' },
  { step: 2, label: 'Configure' },
  { step: 3, label: 'Results' },
];

export function TopBar() {
  const { collection, clearCollection } = useCollection();
  const { currentStep, goToStep } = useStep();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b">
      <h1 className="text-lg font-bold w-40">RBAC Scanner</h1>

      <div className="flex items-center gap-2">
        {STEPS.map(({ step, label }, index) => (
          <div key={step} className="flex items-center">
            <button
              onClick={() => step < currentStep && goToStep(step)}
              disabled={step > currentStep}
              className={classNames(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium transition-colors',
                step === currentStep && 'bg-blue-600 text-white',
                step < currentStep && 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer',
                step > currentStep && 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              <span
                className={classNames(
                  'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                  step === currentStep && 'bg-white text-blue-600',
                  step < currentStep && 'bg-blue-600 text-white',
                  step > currentStep && 'bg-gray-300 text-gray-500'
                )}
              >
                {step < currentStep ? '✓' : step}
              </span>
              {label}
            </button>

            {index < STEPS.length - 1 && (
              <div
                className={classNames(
                  'w-8 h-0.5 mx-1',
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="w-40 flex justify-end">
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
    </div>
  );
}
