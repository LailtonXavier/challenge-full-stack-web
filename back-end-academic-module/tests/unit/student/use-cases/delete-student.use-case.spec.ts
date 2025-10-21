import { DeleteStudentUseCase } from '@/core/student/application/use-cases/delete-student.use-case';
import { StudentRepository } from '@/core/student/domain/repository/student.repository';
import { NotFoundError, FailedValidationError } from '@/shared/errors/app-error';
import { Student } from '@/core/student/domain/entities/student.entity';

describe('DeleteStudentUseCase', () => {
  let deleteStudentUseCase: DeleteStudentUseCase;
  let mockStudentRepository: jest.Mocked<StudentRepository>;

  beforeEach(() => {
    mockStudentRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByRA: jest.fn(),
      findByCPF: jest.fn(),
      findByEmail: jest.fn(),
      findByEmployeeId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      search: jest.fn(),

    };

    deleteStudentUseCase = new DeleteStudentUseCase(mockStudentRepository);
  });

  const mockStudent = new Student(
    'student-123',
    'Lailton',
    'lailton@gmail.com',
    '123456',
    '123.456.789-00',
    true,
    'employee-123',
    new Date(),
    new Date()
  );

  it('should delete student successfully', async () => {
    mockStudentRepository.findById.mockResolvedValue(mockStudent);
    mockStudentRepository.delete.mockResolvedValue(true);

    const result = await deleteStudentUseCase.execute('student-123');

    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(true);
    expect(mockStudentRepository.findById).toHaveBeenCalledWith('student-123');
    expect(mockStudentRepository.delete).toHaveBeenCalledWith('student-123');
  });

  it('should return error when student not found', async () => {
    mockStudentRepository.findById.mockResolvedValue(null);

    const result = await deleteStudentUseCase.execute('non-existent-id');

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
    expect(mockStudentRepository.delete).not.toHaveBeenCalled();
  });

  it('should return error when deletion fails', async () => {
    mockStudentRepository.findById.mockResolvedValue(mockStudent);
    mockStudentRepository.delete.mockResolvedValue(false);

    const result = await deleteStudentUseCase.execute('student-123');

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(FailedValidationError);
  });
});