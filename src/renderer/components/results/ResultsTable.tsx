import { useCollection } from '../../context/CollectionContext';
import { useRoles } from '../../context/RolesContext';
import { useResults } from '../../context/ResultsContext';
import { PUBLIC_ROLE_ID, PUBLIC_ROLE_NAME, METHOD_COLORS } from '../../constants/constants';
import { ResultCell } from './ResultCell';
import { classNames } from '../../utils/classNames';
import { extractPathFromUrl } from '../../utils/variableExtractor';
import type { FlattenedEndpoint } from '../../types/rbac.types';

interface GroupedEndpoints {
  folder: string;
  endpoints: FlattenedEndpoint[];
}

function groupEndpointsByFolder(endpoints: FlattenedEndpoint[]): GroupedEndpoints[] {
  const groups = new Map<string, FlattenedEndpoint[]>();

  for (const endpoint of endpoints) {
    const folderPath = endpoint.path.slice(0, -1).join(' / ') || 'Root';

    if (!groups.has(folderPath)) {
      groups.set(folderPath, []);
    }

    groups.get(folderPath)?.push(endpoint);
  }

  return Array.from(groups.entries()).map(([folder, eps]) => ({
    folder,
    endpoints: eps,
  }));
}

export function ResultsTable() {
  const { getSelectedEndpoints } = useCollection();
  const { roles } = useRoles();
  const { results } = useResults();

  const selectedEndpoints = getSelectedEndpoints();

  if (results.size === 0) {
    return null;
  }

  const allRoles = [...roles, { id: PUBLIC_ROLE_ID, name: PUBLIC_ROLE_NAME, token: '' }];
  const groupedEndpoints = groupEndpointsByFolder(selectedEndpoints);
  const totalColumns = 2 + allRoles.length;

  return (
    <div className="border rounded-lg overflow-auto h-full">
      <table className="w-full text-sm table-fixed">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-700 w-64">
              Endpoint
            </th>
            <th className="px-3 py-2 text-left font-medium text-gray-700 w-20">
              Method
            </th>
            {allRoles.map((role) => (
              <th
                key={role.id}
                className="px-3 py-2 text-center font-medium text-gray-700 w-24"
              >
                {role.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupedEndpoints.map((group) => (
            <GroupSection
              key={group.folder}
              group={group}
              allRoles={allRoles}
              totalColumns={totalColumns}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface GroupSectionProps {
  group: GroupedEndpoints;
  allRoles: { id: string; name: string; token: string }[];
  totalColumns: number;
}

function GroupSection({ group, allRoles, totalColumns }: GroupSectionProps) {
  return (
    <>
      <tr className="bg-gray-50">
        <td
          colSpan={totalColumns}
          className="px-3 py-2 font-semibold text-gray-600 text-sm"
        >
          {group.folder}
        </td>
      </tr>
      {group.endpoints.map((endpoint) => (
        <EndpointRow key={endpoint.id} endpoint={endpoint} allRoles={allRoles} />
      ))}
    </>
  );
}

interface EndpointRowProps {
  endpoint: FlattenedEndpoint;
  allRoles: { id: string; name: string; token: string }[];
}

function EndpointRow({ endpoint, allRoles }: EndpointRowProps) {
  const methodColor = METHOD_COLORS[endpoint.method] ?? '';
  const displayPath = extractPathFromUrl(endpoint.url);

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50">
      <td className="px-3 py-2">
        <div className="font-medium truncate" title={endpoint.name}>
          {endpoint.name}
        </div>
        <div className="text-xs text-gray-400 truncate" title={displayPath}>
          {displayPath}
        </div>
      </td>
      <td className="px-3 py-2">
        <span
          className={classNames(
            'text-xs font-medium px-1.5 py-0.5 rounded',
            methodColor
          )}
        >
          {endpoint.method}
        </span>
      </td>
      {allRoles.map((role) => (
        <ResultCell key={role.id} endpointId={endpoint.id} roleId={role.id} />
      ))}
    </tr>
  );
}
