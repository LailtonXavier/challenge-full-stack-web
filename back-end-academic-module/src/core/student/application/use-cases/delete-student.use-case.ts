import { left, right } from '@/shared/core/utils/validation';
import { FailedValidationError, NotFoundError } from '@/shared/errors/app-error';
import { StudentRepository } from '../../domain/repository/student.repository';

export class DeleteStudentUseCase {
  constructor(private readonly repository: StudentRepository) {}

  async execute(id: string) {
    const existingStudent = await this.repository.findById(id);
    if (!existingStudent) {
      return left(new NotFoundError('Student', id));
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      return left(new FailedValidationError('Failed to delete user'));
    }

    return right(true);
  }
}
