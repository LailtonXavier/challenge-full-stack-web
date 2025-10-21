import { Either, left, right } from '@/shared/core/utils/validation';
import { AppError, InvalidIdError } from '@/shared/errors/app-error';
import { StudentRepository } from '../../domain/repository/student.repository';
import { PaginatedStudents } from '../types/student.types';

export class SearchStudentsUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  async execute(query: string, page: number): Promise<Either<AppError, PaginatedStudents>> {
    if (!query || query.trim() === '') {
      return left(new InvalidIdError('Search query cannot be empty'));
    }

    const students = await this.studentRepository.search(query, page);

    return right(students);
  }
}
