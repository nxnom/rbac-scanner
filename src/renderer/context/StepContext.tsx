import { createContext, useContext, useState, ReactNode } from 'react';

export type Step = 1 | 2 | 3;

interface StepContextValue {
  currentStep: Step;
  goToStep: (step: Step) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const StepContext = createContext<StepContextValue | null>(null);

export function StepProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const value: StepContextValue = {
    currentStep,
    goToStep,
    nextStep,
    prevStep,
  };

  return (
    <StepContext.Provider value={value}>
      {children}
    </StepContext.Provider>
  );
}

export function useStep() {
  const context = useContext(StepContext);

  if (!context) {
    throw new Error('useStep must be used within StepProvider');
  }

  return context;
}
