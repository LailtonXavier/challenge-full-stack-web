import { PaginatedStudents } from '../../application/types/student.types';
import { Student } from '../entities/student.entity';

export interface StudentRepository {
  create(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student>;
  findByEmail(email: string): Promise<Student | null>;
  findById(id: string): Promise<Student | null>;
  findByRA(ra: string): Promise<Student | null>;
  findByCPF(cpf: string): Promise<Student | null>;
  search(query: string, page: number): Promise<PaginatedStudents>;
  findByEmployeeId(employeeId: string, page: number): Promise<PaginatedStudents>;
  update(id: string, data: Partial<Student>): Promise<Student>;
  delete(id: string): Promise<boolean>;
}
