import { StudentController } from '@/core/student/infra/http/controllers/student.controller';
import { CreateStudentUseCase } from '@/core/student/application/use-cases/create-student.use-case';
import { UpdateStudentUseCase } from '@/core/student/application/use-cases/update-student.use-case';
import { DeleteStudentUseCase } from '@/core/student/application/use-cases/delete-student.use-case';
import { ListStudentsUseCase } from '@/core/student/application/use-cases/list-students.use-case';
import { Request, Response } from 'express';
import { left, right } from '@/shared/core/utils/validation';
import { NotFoundError } from '@/shared/errors/app-error';

describe('StudentController (Integration)', () => {
  let controller: StudentController;
  let mockCreateStudentUseCase: jest.Mocked<CreateStudentUseCase>;
  let mockUpdateStudentUseCase: jest.Mocked<UpdateStudentUseCase>;
  let mockDeleteStudentUseCase: jest.Mocked<DeleteStudentUseCase>;
  let mockListStudentsUseCase: jest.Mocked<ListStudentsUseCase>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  const mockStudent = {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
    ra: 'RA001',
    cpf: '123.456.789-00',
    active: true,
    employeeId: 'emp-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    mockCreateStudentUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<CreateStudentUseCase>;

    mockUpdateStudentUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UpdateStudentUseCase>;

    mockDeleteStudentUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<DeleteStudentUseCase>;

    mockListStudentsUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<ListStudentsUseCase>;

    controller = new StudentController(
      mockCreateStudentUseCase,
      mockUpdateStudentUseCase,
      mockDeleteStudentUseCase,
      mockListStudentsUseCase
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
  });

  describe('create', () => {
    it('should create a student and return 201', async () => {
      mockReq.body = {
        name: 'João Silva',
        email: 'joao@example.com',
        ra: 'RA001',
        cpf: '123.456.789-00',
        employeeId: 'emp-1',
      };

      mockCreateStudentUseCase.execute.mockResolvedValue(
        right(mockStudent)
      );

      await controller.create(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ data: mockStudent });
    });

    it('should throw error on creation failure', async () => {
      mockReq.body = {
        name: 'João Silva',
        email: 'joao@example.com',
        ra: 'RA001',
        cpf: '123.456.789-00',
        employeeId: 'emp-1',
      };

      const error = new NotFoundError('Student', 'emp-1');
      mockCreateStudentUseCase.execute.mockResolvedValue(left(error));

      await expect(
        controller.create(mockReq as Request, mockRes as Response)
      ).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a student and return 201', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'João Atualizado', email: 'joao.new@example.com' };

      const updatedStudent = { ...mockStudent, ...mockReq.body };
      mockUpdateStudentUseCase.execute.mockResolvedValue(right(updatedStudent));

      await controller.update(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockUpdateStudentUseCase.execute).toHaveBeenCalledWith('1', {
        name: 'João Atualizado',
        email: 'joao.new@example.com',
      });
    });

    it('should throw error if student not found on update', async () => {
      mockReq.params = { id: '1' };
      mockReq.body = { name: 'João Atualizado' };

      const error = new NotFoundError('Student', '1');
      mockUpdateStudentUseCase.execute.mockResolvedValue(left(error));

      await expect(
        controller.update(mockReq as Request, mockRes as Response)
      ).rejects.toThrow();
    });
  });

  describe('delete', () => {
    it('should delete a student and return 201', async () => {
      mockReq.params = { id: '1' };

      mockDeleteStudentUseCase.execute.mockResolvedValue(right(true));

      await controller.delete(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockDeleteStudentUseCase.execute).toHaveBeenCalledWith('1');
    });

    it('should throw error if student not found on delete', async () => {
      mockReq.params = { id: '1' };

      const error = new NotFoundError('Student', '1');
      mockDeleteStudentUseCase.execute.mockResolvedValue(left(error));

      await expect(
        controller.delete(mockReq as Request, mockRes as Response)
      ).rejects.toThrow();
    });
  });

  describe('listStudents', () => {
    it('should list students by employee and return 200', async () => {
      mockReq.params = { employeeId: 'emp-1' };
      mockReq.query = { page: '1' };

      const paginatedResult = {
        students: [mockStudent],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      mockListStudentsUseCase.execute.mockResolvedValue(right(paginatedResult));

      await controller.listStudents(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockListStudentsUseCase.execute).toHaveBeenCalledWith('emp-1', 1);
    });

    it('should handle missing page query parameter', async () => {
      mockReq.params = { employeeId: 'emp-1' };
      mockReq.query = {};

      const paginatedResult = {
        students: [],
        total: 0,
        page: 1,
        totalPages: 0,
      };

      mockListStudentsUseCase.execute.mockResolvedValue(right(paginatedResult));

      await controller.listStudents(mockReq as Request, mockRes as Response);

      expect(mockListStudentsUseCase.execute).toHaveBeenCalledWith('emp-1', 1);
    });

    it('should throw error if employee not found', async () => {
      mockReq.params = { employeeId: 'emp-invalid' };
      mockReq.query = { page: '1' };

      const error = new NotFoundError('Employee', 'emp-invalid');
      mockListStudentsUseCase.execute.mockResolvedValue(left(error));

      await expect(
        controller.listStudents(mockReq as Request, mockRes as Response)
      ).rejects.toThrow();
    });
  });
});