
import { api } from '../../services/api.services';

export async function deteleStudentService(studentId: string): Promise<boolean> {
  const res = await api.delete<boolean>(`/students/${studentId}`);
  return res
}
