import { Employee } from '../entities/employee.entity';

export interface EmployeeRepository {
  create(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<Employee>;
  findByEmail(email: string): Promise<Employee | null>;
  findById(id: string): Promise<Employee | null>;
}
