
import type { Student } from '@/core/domain/entities/student';
import type { UpdateStudentDTO } from '@/shared/schemas/updateStudentSchema';
import { api } from '../../services/api.services';

export async function updateStudentSerrvice(studentId: string, data: UpdateStudentDTO): Promise<Student> {
  const res = await api.put<Student>(`/students/${studentId}`, data);
  return res
}
