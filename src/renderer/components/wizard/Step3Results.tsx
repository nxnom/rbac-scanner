import { useEffect } from 'react';
import { Button } from '@geckoui/geckoui';
import { useStep } from '../../context/StepContext';
import { ResultsTable } from '../results/ResultsTable';
import { useScanExecutor } from '../../hooks/useScanExecutor';

export function Step3Results() {
  const { prevStep } = useStep();
  const { startScan, isScanning, progress } = useScanExecutor();

  useEffect(() => {
    startScan();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold">Scan Results</h2>
          {isScanning && (
            <span className="text-sm text-blue-600">
              Scanning... ({progress.completed}/{progress.total})
            </span>
          )}
          {!isScanning && progress.total > 0 && (
            <span className="text-sm text-green-600">
              Completed ({progress.completed}/{progress.total})
            </span>
          )}
        </div>

        <Button variant="outlined" onClick={prevStep}>
          Back to Setup
        </Button>
      </div>

      <div className="flex-1 p-4 overflow-auto">
        <ResultsTable />
      </div>
    </div>
  );
}
