import { UpdateStudentUseCase } from '@/core/student/application/use-cases/update-student.use-case';
import { StudentRepository } from '@/core/student/domain/repository/student.repository';
import { NotFoundError, EmailAlreadyExistsError } from '@/shared/errors/app-error';
import { Student } from '@/core/student/domain/entities/student.entity';

describe('UpdateStudentUseCase', () => {
  let updateStudentUseCase: UpdateStudentUseCase;
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

    updateStudentUseCase = new UpdateStudentUseCase(mockStudentRepository);
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

  const updatedStudent = new Student(
    'student-123',
    'Lailton Updated',
    'lailton.updated@example.com',
    '123456',
    '123.456.789-00',
    true,
    'employee-123',
    new Date(),
    new Date()
  );

  it('should update student successfully', async () => {
    mockStudentRepository.findById.mockResolvedValue(mockStudent);
    mockStudentRepository.findByEmail.mockResolvedValue(null);
    mockStudentRepository.update.mockResolvedValue(updatedStudent);

    const result = await updateStudentUseCase.execute('student-123', {
      name: 'John Updated',
      email: 'john.updated@example.com',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(updatedStudent);
    expect(mockStudentRepository.findById).toHaveBeenCalledWith('student-123');
    expect(mockStudentRepository.findByEmail).toHaveBeenCalledWith('john.updated@example.com');
    expect(mockStudentRepository.update).toHaveBeenCalledWith('student-123', {
      ...mockStudent,
      name: 'John Updated',
      email: 'john.updated@example.com',
    });
  });

  it('should return error when student not found', async () => {
    mockStudentRepository.findById.mockResolvedValue(null);

    const result = await updateStudentUseCase.execute('non-existent-id', {
      name: 'John Updated',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it('should return error when email already exists', async () => {
    const existingStudentWithEmail = new Student(
      'student-456',
      'Another Student',
      'existing@example.com',
      '654321',
      '987.654.321-00',
      true,
      'employee-123',
      new Date(),
      new Date()
    );

    mockStudentRepository.findById.mockResolvedValue(mockStudent);
    mockStudentRepository.findByEmail.mockResolvedValue(existingStudentWithEmail);

    const result = await updateStudentUseCase.execute('student-123', {
      email: 'existing@example.com',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(EmailAlreadyExistsError);
  });

  it('should update only name when email is not provided', async () => {
    mockStudentRepository.findById.mockResolvedValue(mockStudent);
    mockStudentRepository.update.mockResolvedValue(updatedStudent);

    const result = await updateStudentUseCase.execute('student-123', {
      name: 'Lailton Updated',
    });

    expect(result.isRight()).toBe(true);
    expect(mockStudentRepository.findByEmail).not.toHaveBeenCalled();
    expect(mockStudentRepository.update).toHaveBeenCalledWith('student-123', {
      ...mockStudent,
      name: 'Lailton Updated',
    });
  });
});