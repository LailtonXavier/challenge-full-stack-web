
import type { Student } from '@/core/domain/entities/student';
import type { CreateStudentDTO } from '@/shared/schemas/registerStudentSchema';
import { api } from '../../services/api.services';

export async function createStudentService(data: CreateStudentDTO): Promise<Student> {
  const res = await api.post<Student>('/students', data);
  return res
}
