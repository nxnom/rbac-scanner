import { useStep, Step } from '../../context/StepContext';
import { classNames } from '../../utils/classNames';

const STEPS: { step: Step; label: string }[] = [
  { step: 1, label: 'Select APIs' },
  { step: 2, label: 'Configure' },
  { step: 3, label: 'Results' },
];

export function StepIndicator() {
  const { currentStep, goToStep } = useStep();

  return (
    <div className="flex items-center justify-center gap-4 py-4 border-b bg-gray-50">
      {STEPS.map(({ step, label }, index) => (
        <div key={step} className="flex items-center">
          <button
            onClick={() => step < currentStep && goToStep(step)}
            disabled={step > currentStep}
            className={classNames(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
              step === currentStep && 'bg-blue-600 text-white',
              step < currentStep && 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer',
              step > currentStep && 'bg-gray-200 text-gray-400 cursor-not-allowed'
            )}
          >
            <span
              className={classNames(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
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
                'w-12 h-0.5 mx-2',
                step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
