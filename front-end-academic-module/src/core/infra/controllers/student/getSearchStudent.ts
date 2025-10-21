import type { PaginatedStudents } from '@/core/domain/entities/student';
import { api } from '../../services/api.services';

export async function searchStudentService(query: string, page: number): Promise<PaginatedStudents> {
  const res = await api.get<PaginatedStudents>(`/students/search?query=${query}&page=${page}`);
  return res
}
