import { CreateEmployeeUseCase } from '@/core/employee/application/use-cases/create-employee.use-case';
import { GetEmployeeUseCase } from '@/core/employee/application/use-cases/get-employee.use-case';
import { EmployeeController } from '@/core/employee/infra/http/controllers/employee.controller';
import { Either, Left, left, Right, right } from '@/shared/core/utils/validation';
import { EmailAlreadyExistsError, NotFoundError } from '@/shared/errors/app-error';
import * as validateSchemaModule from '@/shared/utils/validate-schema';
import { Request, Response } from 'express';

describe('EmployeeController (Integration)', () => {
  let controller: EmployeeController;
  let mockCreateEmployeeUseCase: jest.Mocked<CreateEmployeeUseCase>;
  let mockGetEmployeeUseCase: jest.Mocked<GetEmployeeUseCase>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  const mockEmployee = {
    id: 'emp-1',
    name: 'Admin Test',
    email: 'admin@test.com',
    password: 'hashed-password',
    role: 'admin',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    students: [],
  };

  function mockLeft<L, R>(value: L): Either<L, R> {
    return {
      isLeft(): this is Left<L, R> {
        return true;
      },
      isRight(): this is Right<L, R> {
        return false;
      },
      value,
    } as unknown as Either<L, R>;
  }

  function mockRight<L, R>(value: R): Either<L, R> {
    return {
      isLeft(): this is Left<L, R> {
        return false;
      },
      isRight(): this is Right<L, R> {
        return true;
      },
      value,
    } as unknown as Either<L, R>;
  }

  beforeEach(() => {
    mockCreateEmployeeUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateEmployeeUseCase>;

    mockGetEmployeeUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetEmployeeUseCase>;

    controller = new EmployeeController(
      mockCreateEmployeeUseCase,
      mockGetEmployeeUseCase
    );

    mockReq = {
      body: {},
      params: {},
      query: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.spyOn(validateSchemaModule, 'validateSchema').mockResolvedValue(
      mockRight({})
    );
  });

  describe('create', () => {
    it('should create an employee and return 201', async () => {
      mockReq.body = {
        name: 'Admin Test',
        email: 'admin@test.com',
        password: 'TestPass123!',
      };

      mockCreateEmployeeUseCase.execute.mockResolvedValue(
        right(mockEmployee)
      );

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockEmployee });
    });

    it('should throw error if email already exists', async () => {
      mockReq.body = {
        name: 'Admin Test',
        email: 'admin@test.com',
        password: 'TestPass123!',
      };

      const error = new EmailAlreadyExistsError('admin@test.com');
      mockCreateEmployeeUseCase.execute.mockResolvedValue(left(error));

      await expect(
        controller.create(mockReq as Request, mockRes as Response)
      ).rejects.toThrow();
    });

    it('should throw error on creation failure', async () => {
      const error = new Error('Creation failed');
  
      mockCreateEmployeeUseCase.execute.mockResolvedValue(mockLeft(error));
  
      await expect(controller.create(mockReq as Request, mockRes as Response))
        .rejects.toThrow('Creation failed');
    });    
  });

  describe('getById', () => {
    it('should get an employee by id and return 200', async () => {
      mockReq.params = { id: 'emp-1' };

      mockGetEmployeeUseCase.execute.mockResolvedValue(right(mockEmployee));

      await controller.getById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockEmployee });
      expect(mockGetEmployeeUseCase.execute).toHaveBeenCalledWith('emp-1');
    });

    it('should throw error if employee not found', async () => {
      mockReq.params = { id: 'non-existent' };

      const error = new NotFoundError('Employee', 'non-existent');
      mockGetEmployeeUseCase.execute.mockResolvedValue(left(error));

      await expect(
        controller.getById(mockReq as Request, mockRes as Response)
      ).rejects.toThrow();
    });

    it('should throw error for invalid id', async () => {
      mockReq.params = { id: '' };

      const error = new Error('Invalid ID');
      mockGetEmployeeUseCase.execute.mockResolvedValue(left(error) as any);

      await expect(
        controller.getById(mockReq as Request, mockRes as Response)
      ).rejects.toThrow();
    });
  });
});