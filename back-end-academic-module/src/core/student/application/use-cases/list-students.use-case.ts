import { Either, left, right } from '@/shared/core/utils/validation';
import { AppError, InvalidIdError, NotFoundError } from '@/shared/errors/app-error';
import { StudentRepository } from '../../domain/repository/student.repository';
import { PaginatedStudents } from '../types/student.types';
import { EmployeeRepository } from '@/core/employee/domain/repository/employee.repository';

export class ListStudentsUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly employeeRepository: EmployeeRepository
  ) {}

  async execute(employeeId: string, page: number): Promise<Either<AppError, PaginatedStudents>> {
    if (!employeeId || employeeId.trim() === '') {
      return left(new InvalidIdError());
    }

    const employee = await this.employeeRepository.findById(employeeId);

    if (!employee) {
      return left(new NotFoundError('Employee', employeeId));
    }

    const students = await this.studentRepository.findByEmployeeId(employeeId, page);

    if (students.students.length === 0) {
      return right({
        students: [],
        total: 0,
        page: page,
        totalPages: students.totalPages
      });
    }

    return right(students);
  }
}
