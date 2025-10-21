
import type { PaginatedStudents } from '@/core/domain/entities/student';
import { api } from '../../services/api.services';
import { tokenStore } from '../../store/tokenStore';

export async function getListStudentService(page: number): Promise<PaginatedStudents> {
  const employeeId = await tokenStore.getAccessEmployeeId()
  const res = await api.get<PaginatedStudents>(`/students/employee/${employeeId}?page=${page}`);
  return res
}
