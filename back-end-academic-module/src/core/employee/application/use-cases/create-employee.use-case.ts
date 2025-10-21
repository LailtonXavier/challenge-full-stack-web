import { EmployeeRepository } from '../../domain/repository/employee.repository';
import { CreateEmployeeDTO } from '../dto/create-employee.dto';
import { Employee } from '../../domain/entities/employee.entity';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { Either, left, right } from '@/shared/core/utils/validation';
import { EmailAlreadyExistsError } from '@/shared/errors/app-error';

export class CreateEmployeeUseCase {
  constructor(private readonly repository: EmployeeRepository) {}

  async execute(data: CreateEmployeeDTO): Promise<Either<Error, Employee>> {
    const existing = await this.repository.findByEmail(data.email);
    if (existing) return left(new EmailAlreadyExistsError(data.email));

    const hashed = await bcrypt.hash(data.password, 10);

    const employee = new Employee(
      randomUUID(),
      data.name,
      data.email,
      hashed,
      data.role || 'admin',
      true,
      new Date(),
      new Date()
    );

    const created = await this.repository.create(employee);
    return right(created);
  }
}
