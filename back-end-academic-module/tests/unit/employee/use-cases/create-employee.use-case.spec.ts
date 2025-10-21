import { CreateEmployeeDTO } from '@/core/employee/application/dto/create-employee.dto';
import { CreateEmployeeUseCase } from '@/core/employee/application/use-cases/create-employee.use-case'
import { Employee } from '@/core/employee/domain/entities/employee.entity'
import { EmployeeRepository } from '@/core/employee/domain/repository/employee.repository';
import { EmailAlreadyExistsError } from '@/shared/errors/app-error';

describe('CreateEmployeeUseCase', () => {
    let mockEmployeeRepository: jest.Mocked<EmployeeRepository>;
    let createEmployeeUseCase: CreateEmployeeUseCase

    const mockEmployee: Employee = {
      id: 'uuid-123',
      name: 'Mock Employee',
      email: 'mock.employee@test.com',
      password: 'hashed-password',
      role: 'admin',
      active: true,
      students: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockEmployeeData: CreateEmployeeDTO = {
      name: 'Mock Employee',
      email: 'mock.employee@test.com',
      password: 'hashed-password',
      role: 'admin',
    }

    beforeEach(() => {
      mockEmployeeRepository = {
        findById: jest.fn(),
        create: jest.fn(),
        findByEmail: jest.fn(),
      }

      createEmployeeUseCase = new CreateEmployeeUseCase(
        mockEmployeeRepository
      )
    })

    it('Should create a employee successfully', async () => {
      mockEmployeeRepository.findByEmail.mockResolvedValue(null)
      mockEmployeeRepository.create.mockResolvedValue(mockEmployee)

      const result = await createEmployeeUseCase.execute(mockEmployeeData)

      expect(result.isRight()).toBe(true)
      expect(mockEmployeeRepository.create).toHaveBeenCalled()
      expect(result.value).toEqual(mockEmployee)
    })

    it('Should return EmailAlreadyExistsError when email already exists', async () => {
      mockEmployeeRepository.findByEmail.mockResolvedValue(mockEmployee)
  
      const result = await createEmployeeUseCase.execute(mockEmployeeData)
  
      expect(result.isLeft()).toBe(true)
      expect(result.value).toBeInstanceOf(EmailAlreadyExistsError)
  })


})