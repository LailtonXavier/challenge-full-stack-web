import { Employee } from '@/core/employee/domain/entities/employee.entity';
import { EmployeeRepository } from '@/core/employee/domain/repository/employee.repository';
import { CreateStudentUseCase } from '@/core/student/application/use-cases/create-student.use-case';
import { Student } from '@/core/student/domain/entities/student.entity';
import { StudentRepository } from '@/core/student/domain/repository/student.repository';
import { AlreadyExistsError, EmailAlreadyExistsError, NotFoundError } from '@/shared/errors/app-error';

describe('CreateStudentUseCase', () => {
  let mockStudentRepository: jest.Mocked<StudentRepository>;
  let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;
  let createStudentUseCase: CreateStudentUseCase

  const mockStudentData = {
    name: 'Lailton',
    email: 'lailton@gmail.com',
    ra: '12345',
    cpf: '98765432100',
    employeeId: 'emp-123',
  }

  const mockStudent = new Student(
    'uuid-123',
    mockStudentData.name,
    mockStudentData.email,
    mockStudentData.ra,
    mockStudentData.cpf,
    true,
    mockStudentData.employeeId,
    new Date(),
    new Date()
  )

  const mockEmployee: Employee = {
    id: mockStudent.id,
    name: 'Mock Employee',
    email: 'mock.employee@test.com',
    password: 'hashed-password',
    role: 'admin',
    active: true,
    students: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    mockStudentRepository = {
      findByEmail: jest.fn(),
      findByRA: jest.fn(),
      findByCPF: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findByEmployeeId: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      search: jest.fn(),

    }

    mockEmployeeRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
    }

    createStudentUseCase = new CreateStudentUseCase(
      mockStudentRepository,
      mockEmployeeRepository
    )
  })

  it('should create a student successfully', async () => {
    mockEmployeeRepository.findById.mockResolvedValue(mockEmployee)
    mockStudentRepository.findByEmail.mockResolvedValue(null)
    mockStudentRepository.findByRA.mockResolvedValue(null)
    mockStudentRepository.findByCPF.mockResolvedValue(null)
    mockStudentRepository.create.mockResolvedValue(mockStudent)

    const result = await createStudentUseCase.execute(mockStudentData)

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(mockStudent)
    expect(mockStudentRepository.create).toHaveBeenCalled()
  })

  it('should return error when employee does not exist', async () => {
    mockEmployeeRepository.findById.mockResolvedValue(null)

    const result = await createStudentUseCase.execute(mockStudentData)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundError)
  })

  it('should return error when email already exists', async () => {
    mockEmployeeRepository.findById.mockResolvedValue(mockEmployee)
    mockStudentRepository.findByEmail.mockResolvedValue(mockStudent)

    const result = await createStudentUseCase.execute(mockStudentData)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)
  })

  it('should return error when RA already exists', async () => {
    mockEmployeeRepository.findById.mockResolvedValue(mockEmployee)
    mockStudentRepository.findByEmail.mockResolvedValue(null)
    mockStudentRepository.findByRA.mockResolvedValue(mockStudent)

    const result = await createStudentUseCase.execute(mockStudentData)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })

  it('should return error when CPF already exists', async () => {
    mockEmployeeRepository.findById.mockResolvedValue(mockEmployee)
    mockStudentRepository.findByEmail.mockResolvedValue(null)
    mockStudentRepository.findByRA.mockResolvedValue(null)
    mockStudentRepository.findByCPF.mockResolvedValue(mockStudent)

    const result = await createStudentUseCase.execute(mockStudentData)

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsError)
  })
})
