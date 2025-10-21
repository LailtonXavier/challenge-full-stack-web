import { z } from 'zod';

export const CreateStudentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  ra: z.string().min(1, 'RA is required'),
  cpf: z.string().min(1, 'CPF is required'),
  employeeId: z.string().min(1, 'Employee ID is required'),
});

export type CreateStudentDTO = z.infer<typeof CreateStudentSchema>;