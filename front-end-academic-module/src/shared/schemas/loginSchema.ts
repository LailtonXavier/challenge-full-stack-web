import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha obrigatória"),
});

export type LoginDto = z.infer<typeof LoginSchema>;