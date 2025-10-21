import { PaginatedStudents } from '@/core/student/application/types/student.types';
import { Student } from '@/core/student/domain/entities/student.entity';
import { StudentRepository } from '@/core/student/domain/repository/student.repository';
import { prisma } from '@/infra/database/prisma/prismaClient';
import { Prisma } from '@prisma/client';


export class PrismaStudentRepository implements StudentRepository {
  private readonly DEFAULT_LIMIT = 10;

  async create(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>): Promise<Student> {
    return prisma.student.create({ data });
  }

  async findById(id: string): Promise<Student | null> {
    return prisma.student.findUnique({ where: { id } });
  }

  async findByRA(ra: string): Promise<Student | null> {
    return prisma.student.findUnique({ where: { ra } });
  }

  async findByCPF(cpf: string): Promise<Student | null> {
    return prisma.student.findUnique({ where: { cpf } });
  }

  async findByEmail(email: string): Promise<Student | null> {
    return prisma.student.findUnique({ where: { email } });
  }

  async search(query: string, page: number): Promise<PaginatedStudents> {
    const limit = this.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;
  
    const where: Prisma.StudentWhereInput = {
      OR: [
        { name: { contains: query, mode: Prisma.QueryMode.insensitive } },
        { ra: { contains: query, mode: Prisma.QueryMode.insensitive } },
        { cpf: { contains: query, mode: Prisma.QueryMode.insensitive } },
      ],
    };
  
    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.student.count({ where }),
    ]);
  
    return {
      students,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  

  async findByEmployeeId(employeeId: string, page: number): Promise<PaginatedStudents> {
    const limit = this.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where: { employeeId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.student.count({ where: { employeeId } }),
    ]);

    return {
      students,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }  

  async update(id: string, data: Partial<Student>): Promise<Student> {
    return prisma.student.update({ where: { id }, data });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.student.delete({ where: { id } });
    return true;
  }
}
