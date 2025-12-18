import { z } from 'zod';

export const roleFormSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50, 'Role name is too long'),
  token: z.string().min(1, 'Token is required'),
});

export type RoleFormValues = z.infer<typeof roleFormSchema>;
