import { GeckoUIPortal } from '@geckoui/geckoui';
import { CollectionProvider } from './context/CollectionContext';
import { VariablesProvider } from './context/VariablesContext';
import { RolesProvider } from './context/RolesContext';
import { ResultsProvider } from './context/ResultsContext';
import { ScannerPage } from './pages/ScannerPage';

function App() {
  return (
    <CollectionProvider>
      <VariablesProvider>
        <RolesProvider>
          <ResultsProvider>
            <ScannerPage />
            <GeckoUIPortal />
          </ResultsProvider>
        </RolesProvider>
      </VariablesProvider>
    </CollectionProvider>
  );
}

export default App;
