import { z } from 'zod';

export const UpdateStudentSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
});

export type UpdateStudentDTO = z.infer<typeof UpdateStudentSchema>;