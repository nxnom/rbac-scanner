import { useState } from 'react';
import { Button } from '@geckoui/geckoui';
import { useCollection } from '../context/CollectionContext';
import { useResults } from '../context/ResultsContext';
import { TopBar } from '../components/layout/TopBar';
import { CollectionImport } from '../components/collection/CollectionImport';
import { CollectionTree } from '../components/collection/CollectionTree';
import { RolesPanel } from '../components/roles/RolesPanel';
import { ResultsTable } from '../components/results/ResultsTable';
import { useScanExecutor } from '../hooks/useScanExecutor';

type ViewMode = 'setup' | 'results';

export function ScannerPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('setup');
  const { collection, selectedIds } = useCollection();
  const { clearResults } = useResults();
  const { executeScan, isScanning } = useScanExecutor();

  const canScan = selectedIds.size > 0;

  const handleRunScan = async () => {
    setViewMode('results');
    await executeScan();
  };

  const handleBackToSetup = () => {
    clearResults();
    setViewMode('setup');
  };

  if (!collection) {
    return (
      <div className="flex flex-col h-screen">
        <TopBar />
        <div className="flex-1 p-4">
          <CollectionImport />
        </div>
      </div>
    );
  }

  if (viewMode === 'results') {
    return (
      <div className="flex flex-col h-screen">
        <TopBar />
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Scan Results</h2>
          <Button variant="outlined" onClick={handleBackToSetup}>
            Back to Setup
          </Button>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          <ResultsTable />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r p-4 overflow-auto">
          <CollectionTree />
        </div>

        <div className="w-1/2 p-4 flex flex-col">
          <div className="flex-1 overflow-auto">
            <RolesPanel />
          </div>

          <div className="pt-4 border-t mt-4">
            <Button
              onClick={handleRunScan}
              disabled={!canScan || isScanning}
              className="w-full"
            >
              {isScanning ? 'Scanning...' : 'Run Scan'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
