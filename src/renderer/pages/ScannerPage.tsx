import { useStep } from '../context/StepContext';
import { TopBar } from '../components/layout/TopBar';
import { Step1SelectAPIs } from '../components/wizard/Step1SelectAPIs';
import { Step2Configure } from '../components/wizard/Step2Configure';
import { Step3Results } from '../components/wizard/Step3Results';

export function ScannerPage() {
  const { currentStep } = useStep();

  return (
    <div className="flex flex-col h-screen">
      <TopBar />

      <div className="flex-1 overflow-hidden">
        {currentStep === 1 && <Step1SelectAPIs />}
        {currentStep === 2 && <Step2Configure />}
        {currentStep === 3 && <Step3Results />}
      </div>
    </div>
  );
}
