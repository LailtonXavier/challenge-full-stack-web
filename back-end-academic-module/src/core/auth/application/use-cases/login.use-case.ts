import { EmployeeRepository } from '@/core/employee/domain/repository/employee.repository';
import { Either, left, right } from '@/shared/core/utils/validation';
import { AppError, InvalidCredentialsError } from '@/shared/errors/app-error';
import { LoginInput } from '../dto/login.dto';
import { JwtService } from '../services/jwt.service';
import { PasswordService } from '../services/password.service';
import { LoginResponse } from '../types/login.types';

export class LoginUseCase {
  private readonly jwtService = new JwtService();
  private readonly passwordService = new PasswordService();

  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(input: LoginInput): Promise<Either<AppError, LoginResponse>> {
    const employee = await this.employeeRepository.findByEmail(input.email);

    if (!employee) {
      return left(new InvalidCredentialsError());
    }

    const passwordMatches = await this.passwordService.compare(
      input.password,
      employee.password
    );

    if (!passwordMatches) {
      return left(new InvalidCredentialsError());
    }

    const { accessToken, refreshToken } = this.jwtService.generateTokens({
      id: employee.id,
      email: employee.email,
    });

    return right({
      accessToken,
      refreshToken,
      employee: {
        id: employee.id,
        email: employee.email,
      },
    });
  }
}