import { GetEmployeeUseCase } from '@/core/employee/application/use-cases/get-employee.use-case';
import { Employee } from '@/core/employee/domain/entities/employee.entity';
import { EmployeeRepository } from '@/core/employee/domain/repository/employee.repository';
import { InvalidIdError, NotFoundError } from '@/shared/errors/app-error';
import { EmployeeMapper, EmployeeResponseDto } from '@/core/employee/application/types/employee.types';

jest.mock('@/core/employee/application/types/employee.types', () => ({
  EmployeeMapper: {
    toResponseDto: jest.fn(employee => ({ 
        id: employee.id, 
        name: employee.name, 
        email: employee.email,
        role: 'admin',
        active: true,
        students: [],
        createdAt: new Date,
        updatedAt: new Date,
    })),
  },
}));

describe('GetEmployeeUseCase', () => {
  let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;
  let getEmployeeUseCase: GetEmployeeUseCase;

  const mockEmployeeId = 'valid-uuid-123';
  const mockEmployee = {
    id: mockEmployeeId,
    name: 'Teste Name',
    email: 'test@email.com',
    password: 'hashed',
    role: 'admin',
    active: true,
    students: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Employee;

  const mockResponseDto: EmployeeResponseDto = {
      id: mockEmployeeId,
      name: 'Teste Name',
      email: 'test@email.com',
      active: true,
      role: 'admin',
      students: [],
      createdAt: new Date,
      updatedAt: new Date,
  };

  beforeEach(() => {
    mockEmployeeRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as jest.Mocked<EmployeeRepository>; 
    
    getEmployeeUseCase = new GetEmployeeUseCase(mockEmployeeRepository);
    
    (EmployeeMapper.toResponseDto as jest.Mock).mockClear();
  });

  it('should return the Employee DTO on success', async () => {
    mockEmployeeRepository.findById.mockResolvedValue(mockEmployee);
    
    (EmployeeMapper.toResponseDto as jest.Mock).mockReturnValue(mockResponseDto);

    const result = await getEmployeeUseCase.execute(mockEmployeeId);

    expect(mockEmployeeRepository.findById).toHaveBeenCalledWith(mockEmployeeId);
    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(mockResponseDto);
    expect(EmployeeMapper.toResponseDto).toHaveBeenCalledWith(mockEmployee);
  });

  it.each(['', ' ', null, undefined])(
    'should return InvalidIdError when ID is invalid or empty: %s', 
    async (invalidId: any) => {
      const result = await getEmployeeUseCase.execute(invalidId);

      expect(mockEmployeeRepository.findById).not.toHaveBeenCalled();
      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InvalidIdError);
    }
  );

  it('should return NotFoundError when employee is not found', async () => {
    mockEmployeeRepository.findById.mockResolvedValue(null);

    const result = await getEmployeeUseCase.execute(mockEmployeeId);

    expect(mockEmployeeRepository.findById).toHaveBeenCalledWith(mockEmployeeId);
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
    expect((result.value as NotFoundError).message).toContain('Employee'); 
  });
});