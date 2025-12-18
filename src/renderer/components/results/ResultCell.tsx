import { Spinner, Tooltip } from '@geckoui/geckoui';
import { useResults } from '../../context/ResultsContext';
import type { ScanStatus } from '../../types/rbac.types';

interface ResultCellProps {
  endpointId: string;
  roleId: string;
}

function StatusIcon({ status }: { status: ScanStatus }) {
  switch (status) {
    case 'loading':
      return <Spinner className="size-4" />;
    case 'success':
      return <span className="text-green-600">✓</span>;
    case 'serverError':
      return <span className="text-orange-500">✓</span>;
    case 'forbidden':
      return <span className="text-red-600">✕</span>;
    case 'error':
      return <span className="text-yellow-600">⚠</span>;
    default:
      return <span className="text-gray-300">–</span>;
  }
}

export function ResultCell({ endpointId, roleId }: ResultCellProps) {
  const { getResult } = useResults();
  const result = getResult(endpointId, roleId);

  if (!result) {
    return (
      <td className="px-3 py-2 text-center">
        <span className="text-gray-300">–</span>
      </td>
    );
  }

  const tooltipContent = result.httpStatus
    ? `HTTP ${result.httpStatus}`
    : result.errorMessage ?? result.status;

  return (
    <td className="px-3 py-2 text-center">
      <Tooltip content={tooltipContent}>
        <span className="inline-flex items-center justify-center w-6 h-6">
          <StatusIcon status={result.status} />
        </span>
      </Tooltip>
    </td>
  );
}
