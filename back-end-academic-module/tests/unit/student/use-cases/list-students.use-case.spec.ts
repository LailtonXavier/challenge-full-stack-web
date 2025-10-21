import { ListStudentsUseCase } from '@/core/student/application/use-cases/list-students.use-case';
import { StudentRepository } from '@/core/student/domain/repository/student.repository';
import { EmployeeRepository } from '@/core/employee/domain/repository/employee.repository';
import { InvalidIdError, NotFoundError } from '@/shared/errors/app-error';
import { Student } from '@/core/student/domain/entities/student.entity';

describe('ListStudentsUseCase', () => {
  let listStudentsUseCase: ListStudentsUseCase;
  let mockStudentRepository: jest.Mocked<StudentRepository>;
  let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;

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

    mockEmployeeRepository = {
      findById: jest.fn(),
      create:  jest.fn(),
      findByEmail: jest.fn(),
    };

    listStudentsUseCase = new ListStudentsUseCase(
      mockStudentRepository,
      mockEmployeeRepository
    );
  });

  const mockEmployee = {
    id: 'employee-123',
    name: 'Employee Name',
  };

  const mockStudents = [
    new Student(
      'student-1',
      'Lailton',
      'lailton@gmail.com',
      '123456',
      '123.456.789-00',
      true,
      'employee-123',
      new Date(),
      new Date()
    ),
    new Student(
      'student-2',
      'Body',
      'boby@gmail.com',
      '123457',
      '123.456.789-01',
      true,
      'employee-123',
      new Date(),
      new Date()
    ),
  ];

  it('should list students successfully', async () => {
    mockEmployeeRepository.findById.mockResolvedValue(mockEmployee as any);
    mockStudentRepository.findByEmployeeId.mockResolvedValue({
      students: mockStudents,
      total: 2,
      page: 1,
      totalPages: 1,
    });

    const result = await listStudentsUseCase.execute('employee-123', 1);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      students: mockStudents,
      total: 2,
      page: 1,
      totalPages: 1,
    });
    expect(mockEmployeeRepository.findById).toHaveBeenCalledWith('employee-123');
    expect(mockStudentRepository.findByEmployeeId).toHaveBeenCalledWith('employee-123', 1);
  });

  it('should return error when employeeId is empty', async () => {
    const result = await listStudentsUseCase.execute('', 1);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InvalidIdError);
  });

  it('should return error when employee not found', async () => {
    mockEmployeeRepository.findById.mockResolvedValue(null);

    const result = await listStudentsUseCase.execute('non-existent-employee', 1);

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it('should return empty array when no students found', async () => {
    mockEmployeeRepository.findById.mockResolvedValue(mockEmployee as any);
    mockStudentRepository.findByEmployeeId.mockResolvedValue({
      students: [],
      total: 0,
      page: 1,
      totalPages: 0,
    });

    const result = await listStudentsUseCase.execute('employee-123', 1);

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      students: [],
      total: 0,
      page: 1,
      totalPages: 0,
    });
  });
});