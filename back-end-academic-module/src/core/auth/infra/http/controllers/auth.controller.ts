import { LoginUseCase } from '@/core/auth/application/use-cases/login.use-case';
import { JwtService } from '@/core/auth/application/services/jwt.service';
import { PrismaEmployeeRepository } from '@/core/employee/infra/prisma/repositories/prisma-employee.repository';
import { UnauthorizedError } from '@/shared/errors/app-error';
import { Request, Response } from 'express';
import { JwtBlacklistService } from '@/core/auth/application/services/jwt-blacklist.service';

export class AuthController {
  private readonly loginUseCase: LoginUseCase;
  private readonly jwtService: JwtService;

  constructor(loginUseCase?: LoginUseCase, jwtService?: JwtService) {
    this.loginUseCase =
      loginUseCase || new LoginUseCase(new PrismaEmployeeRepository());
    this.jwtService = jwtService || new JwtService();
  }

  async login(req: Request, res: Response): Promise<Response> {
    const result = await this.loginUseCase.execute(req.body);

    if (result.isLeft()) {
      throw result.value;
    }

    return res.status(200).json({
      data: result.value,
    });
  }

  async refreshToken(req: Request, res: Response): Promise<Response> {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required');
    }

    try {
      const payload = this.jwtService.verifyRefreshToken(refreshToken);
      const tokens = this.jwtService.generateTokens(payload);

      return res.status(200).json({
        data: tokens,
      });
    } catch (error) {
      throw new UnauthorizedError(
        error instanceof Error ? error.message : 'Invalid refresh token'
      );
    }
  }

  logout(req: Request, res: Response): Response {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(400).json({ message: 'Token is required for logout' });
    }

    const token = authHeader.substring(7);

    JwtBlacklistService.revoke(token);

    return res.status(200).json({
      message: 'Logout successful. Token revoked.',
    });
  }
}