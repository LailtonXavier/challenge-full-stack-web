import { z } from 'zod';

export const CreateEmployeeSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.string().optional(),
});

export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeSchema>;
