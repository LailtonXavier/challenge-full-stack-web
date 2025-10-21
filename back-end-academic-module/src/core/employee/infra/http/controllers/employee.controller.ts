import { CreateEmployeeUseCase } from '@/core/employee/application/use-cases/create-employee.use-case';
import { GetEmployeeUseCase } from '@/core/employee/application/use-cases/get-employee.use-case';
import { Request, Response } from 'express';
import { PrismaEmployeeRepository } from '../../prisma/repositories/prisma-employee.repository';
import { validateSchema } from '@/shared/utils/validate-schema';
import { CreateEmployeeSchema } from '@/core/employee/application/dto/create-employee.dto';

export class EmployeeController {
  private readonly createEmployeeUseCase: CreateEmployeeUseCase;
  private readonly getEmployeeUseCase: GetEmployeeUseCase;

  constructor(
    createEmployeeUseCase?: CreateEmployeeUseCase,
    getEmployeeUseCase?: GetEmployeeUseCase,
  ) {
    const repository = new PrismaEmployeeRepository();

    this.createEmployeeUseCase =
      createEmployeeUseCase ||
      new CreateEmployeeUseCase(repository);
    this.getEmployeeUseCase =
      getEmployeeUseCase ||
      new GetEmployeeUseCase(repository);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const validation = await validateSchema(CreateEmployeeSchema, req.body);

    if (validation.isLeft()) {
      return res.status(400).json({
        message: validation.value.message,
      });
    }

    const result = await this.createEmployeeUseCase.execute(req.body);

    if (result.isLeft()) {
      throw result.value;
    }

    return res.status(201).json({ data: result.value });
  }

  async getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const result = await this.getEmployeeUseCase.execute(id);
  
    if (result.isLeft()) {
      throw result.value;
    }
  
    return res.status(200).json({ data: result.value });
  }
}
