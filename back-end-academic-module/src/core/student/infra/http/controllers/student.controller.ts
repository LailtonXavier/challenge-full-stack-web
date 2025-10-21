import { CreateStudentSchema } from '@/core/student/application/dto/create-student.dto';
import { CreateStudentUseCase } from '@/core/student/application/use-cases/create-student.use-case';
import { DeleteStudentUseCase } from '@/core/student/application/use-cases/delete-student.use-case';
import { UpdateStudentUseCase } from '@/core/student/application/use-cases/update-student.use-case';
import { validateSchema } from '@/shared/utils/validate-schema';
import { Request, Response } from 'express';
import { PrismaStudentRepository } from '../prisma/prisma-student.repository';
import { ListStudentsUseCase } from '@/core/student/application/use-cases/list-students.use-case';
import { PrismaEmployeeRepository } from '@/core/employee/infra/prisma/repositories/prisma-employee.repository';
import { SearchStudentsUseCase } from '@/core/student/application/use-cases/search-students.use-case';

export class StudentController {
  private readonly createStudentUseCase: CreateStudentUseCase;
  private readonly updateStudentUseCase: UpdateStudentUseCase;
  private readonly deleteStudentUseCase: DeleteStudentUseCase;
  private readonly listStudentsUseCase: ListStudentsUseCase;
  private readonly searchStudentsUseCase: SearchStudentsUseCase;

  constructor(
    createStudentUseCase?: CreateStudentUseCase,
    updateStudentUseCase?: UpdateStudentUseCase,
    deleteStudentUseCase?: DeleteStudentUseCase,
    listStudentsUseCase?: ListStudentsUseCase,
    searchStudentsUseCase?: SearchStudentsUseCase,
  ) {
    const repository = new PrismaStudentRepository();
    const repositoryEmployee = new PrismaEmployeeRepository();

    this.createStudentUseCase =
      createStudentUseCase ||
      new CreateStudentUseCase(repository, repositoryEmployee);
    this.updateStudentUseCase =
      updateStudentUseCase ||
      new UpdateStudentUseCase(repository);
    this.deleteStudentUseCase =
      deleteStudentUseCase ||
      new DeleteStudentUseCase(repository);
    this.listStudentsUseCase =
      listStudentsUseCase ||
      new ListStudentsUseCase(repository, repositoryEmployee); 
    this.searchStudentsUseCase =
      searchStudentsUseCase ||
      new SearchStudentsUseCase(repository);
  
  }

  async create(req: Request, res: Response): Promise<Response> {
    const validation = await validateSchema(CreateStudentSchema, req.body);

    if (validation.isLeft()) {
      return res.status(400).json({
        message: validation.value.message,
      });
    }

    const result = await this.createStudentUseCase.execute(req.body);

    if (result.isLeft()) {
      throw result.value;
    }

    return res.status(201).json({ data: result.value });
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, email } = req.body;

    const result = await this.updateStudentUseCase.execute(id, {name, email});

    if (result.isLeft()) {
      throw result.value;
    }

    return res.status(201).json({ data: result.value });
  }

  async listStudents(req: Request, res: Response): Promise<Response> {
    const { employeeId } = req.params;
    const page = Number(req.query.page) || 1;

    const result = await this.listStudentsUseCase.execute(employeeId, page);

    if (result.isLeft()) {
      throw result.value;
    }

    return res.status(200).json({ data: result.value });
  }

  async searchStudents(req: Request, res: Response): Promise<Response> {
    const query = String(req.query.query || '');
    const page = Number(req.query.page) || 1;
  
    const result = await this.searchStudentsUseCase.execute(query, page);
  
    if (result.isLeft()) {
      throw result.value;
    }
  
    return res.status(200).json({ data: result.value });
  }
  

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const result = await this.deleteStudentUseCase.execute(id);

    if (result.isLeft()) {
      throw result.value;
    }

    return res.status(201).json({ data: result.value });
  } 

}
