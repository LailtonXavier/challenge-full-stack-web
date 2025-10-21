import { left, right } from '@/shared/core/utils/validation';
import { EmailAlreadyExistsError, NotFoundError } from '@/shared/errors/app-error';
import { StudentRepository } from '../../domain/repository/student.repository';

export class UpdateStudentUseCase {
  constructor(private readonly repository: StudentRepository) {}

  async execute(id: string, data: { name?: string; email?: string }) {
    const existingStudent = await this.repository.findById(id);
    if (!existingStudent) {
      return left(new NotFoundError('Student', id));
    }

    if (data.email && data.email !== existingStudent.email) {
      const studentWithEmail = await this.repository.findByEmail(data.email);
      if (studentWithEmail) {
        return left(new EmailAlreadyExistsError(data.email));
      }
    }

    const updatedStudent = await this.repository.update(id, {
      ...existingStudent,
      ...data
    });
    
    return right(updatedStudent);
  }
}