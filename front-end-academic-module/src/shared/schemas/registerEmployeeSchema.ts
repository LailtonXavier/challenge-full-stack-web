import { z } from 'zod';

export const RegisterEmployeeSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
});

export type EmployeeDto = z.infer<typeof RegisterEmployeeSchema>;