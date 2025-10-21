import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@/core/auth/application/services/jwt.service';
import { TokenPayload } from '@/core/auth/application/types/token-payload.types';
import { UnauthorizedError } from '@/shared/errors/app-error';
import { JwtBlacklistService } from '@/core/auth/application/services/jwt-blacklist.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export class AuthMiddleware {
  private readonly jwtService = new JwtService();

  authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = this.extractToken(req);

      if (!token || JwtBlacklistService.isRevoked(token)) {
        throw new UnauthorizedError('Missing authorization token');
      }
      
      const payload = this.jwtService.verifyAccessToken(token);
      req.user = payload;

      next();
    } catch (error) {
      throw new UnauthorizedError(
        error instanceof Error ? error.message : 'Invalid token'
      );
    }
  };

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    return authHeader.substring(7);
  }
}