import { Button } from '@geckoui/geckoui';
import { useRoles } from '../../context/RolesContext';
import { AddRoleForm } from './AddRoleForm';

export function RolesPanel() {
  const { roles, removeRole } = useRoles();

  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Roles</h2>

      {roles.length > 0 && (
        <div className="space-y-2">
          {roles.map((role) => (
            <div
              key={role.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{role.name}</p>
                <p className="text-xs text-gray-400 font-mono">
                  {role.token.length > 20
                    ? `${role.token.substring(0, 10)}...${role.token.substring(role.token.length - 10)}`
                    : role.token}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeRole(role.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}

      <AddRoleForm />

      <p className="text-xs text-gray-500">
        Public requests (no auth) are always included in scans.
      </p>
    </div>
  );
}
