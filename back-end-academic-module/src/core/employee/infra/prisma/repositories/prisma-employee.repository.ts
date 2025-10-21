import { Employee } from '@/core/employee/domain/entities/employee.entity';
import { EmployeeRepository } from '@/core/employee/domain/repository/employee.repository';
import { prisma } from '@/infra/database/prisma/prismaClient';
import { EmployeeMapper } from '../mappers/employee.mapper';

export class PrismaEmployeeRepository implements EmployeeRepository {
  async create(employee: Employee): Promise<Employee> {
    const data = EmployeeMapper.toPrisma(employee);
    const created = await prisma.employee.create({ data });
    return EmployeeMapper.toDomain(created);
  }

  async findByEmail(email: string): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: { email },
      include: {
        students: true,
      }
    });
  }

  async findById(id: string): Promise<Employee | null> {
    return prisma.employee.findUnique({
      where: { id },
      include: {
        students: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }
}