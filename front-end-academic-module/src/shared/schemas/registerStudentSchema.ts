import { z } from 'zod';

export const CreateStudentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email format'),
  ra: z.string()
  .regex(/^\d{8}$/, { message: 'RA inválido. Use apenas números e 8 dígitos.' })
  .length(8, 'RA deve ter 8 dígitos'),
  cpf: z.string()
  .regex(/^\d{11}$/, { message: 'CPF inválido. Use apenas números e 11 dígitos.' })
  .length(11, 'CPF deve ter 11 dígitos'),
  employeeId: z.string().min(1, 'Employee ID is required'),
});

export type CreateStudentDTO = z.infer<typeof CreateStudentSchema>;