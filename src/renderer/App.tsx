import { GeckoUIPortal } from '@geckoui/geckoui';
import { CollectionProvider } from './context/CollectionContext';
import { VariablesProvider } from './context/VariablesContext';
import { RolesProvider } from './context/RolesContext';
import { ResultsProvider } from './context/ResultsContext';
import { StepProvider } from './context/StepContext';
import { EnvironmentProvider } from './context/EnvironmentContext';
import { ScannerPage } from './pages/ScannerPage';

function App() {
  return (
    <StepProvider>
      <CollectionProvider>
        <VariablesProvider>
          <RolesProvider>
            <ResultsProvider>
              <EnvironmentProvider>
                <ScannerPage />
                <GeckoUIPortal />
              </EnvironmentProvider>
            </ResultsProvider>
          </RolesProvider>
        </VariablesProvider>
      </CollectionProvider>
    </StepProvider>
  );
}

export default App;
