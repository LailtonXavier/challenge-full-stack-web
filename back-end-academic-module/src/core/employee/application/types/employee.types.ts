import { Student } from '@/core/student/domain/entities/student.entity';

export interface EmployeeResponseDto {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  students: Student[];
  createdAt: Date;
  updatedAt: Date;
}

export class EmployeeMapper {
  static toResponseDto(employee: {
    id: string;
    name: string;
    email: string;
    role: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    students?: Array<{
      id: string;
      name: string;
      email: string;
      ra: string;
      cpf: string;
      active: boolean;
      employeeId?: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  }): EmployeeResponseDto {
    return {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      active: employee.active,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      students:
        employee.students?.map((s) => ({
          id: s.id,
          name: s.name,
          email: s.email,
          ra: s.ra,
          cpf: s.cpf,
          active: s.active,
          employeeId: s.employeeId ?? employee.id,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
        })) ?? [],
    };
  }
}
