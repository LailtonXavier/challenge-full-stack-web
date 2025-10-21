
import type { Employee } from '@/core/domain/entities/employee';
import type { LoginDto } from '@/core/domain/types/login.types';
import { api } from '../../services/api.services';

export async function createEmployeeService(data: LoginDto): Promise<Employee> {
  const res = await api.post<Employee>('/employees', data);
  return res
}
