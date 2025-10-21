import { Either, left, right } from '@/shared/core/utils/validation';
import { AppError, InvalidIdError, NotFoundError } from '@/shared/errors/app-error';
import { EmployeeRepository } from '../../domain/repository/employee.repository';
import { EmployeeMapper, EmployeeResponseDto } from '../types/employee.types';

export class GetEmployeeUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(id: string): Promise<Either<AppError, EmployeeResponseDto>> {
    if (!id || id.trim() === '') {
      return left(new InvalidIdError());
    }

    const employee = await this.employeeRepository.findById(id);

    if (!employee) {
      return left(new NotFoundError('Employee', id));
    }

    const responseDto = EmployeeMapper.toResponseDto(employee);

    return right(responseDto);
  }
}
