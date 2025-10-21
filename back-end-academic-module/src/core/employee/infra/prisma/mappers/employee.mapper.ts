import { Employee } from '@/core/employee/domain/entities/employee.entity';
import { Prisma } from '@prisma/client';

export class EmployeeMapper {
  static toPrisma(employee: Employee): Prisma.EmployeeCreateInput {
    return {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      password: employee.password,
      role: employee.role,
      active: employee.active,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      students: {
        connect: employee.students.map(student => ({ id: student.id })),
      },
    };
  }

  static toDomain(raw: any): Employee {
    return new Employee(
      raw.id,
      raw.name,
      raw.email,
      raw.password,
      raw.role,
      raw.active,
      raw.createdAt,
      raw.updatedAt,
      [],
    );
  }
}