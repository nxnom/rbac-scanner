import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, RHFInput, RHFInputGroup } from '@geckoui/geckoui';
import { useRoles } from '../../context/RolesContext';
import { roleFormSchema, RoleFormValues } from '../../schemas/roleForm.schema';

export function AddRoleForm() {
  const { addRole } = useRoles();

  const methods = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      token: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = (data: RoleFormValues) => {
    addRole(data.name, data.token);
    methods.reset();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-3">
        <RHFInputGroup label="Role Name" required>
          <RHFInput name="name" placeholder="e.g., Admin" />
        </RHFInputGroup>

        <RHFInputGroup label="Bearer Token" required>
          <RHFInput name="token" type="password" placeholder="Enter token" />
        </RHFInputGroup>

        <Button type="submit" className="w-full">
          Add Role
        </Button>
      </form>
    </FormProvider>
  );
}
