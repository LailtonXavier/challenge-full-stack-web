import jwt, { SignOptions, VerifyOptions, JwtPayload } from 'jsonwebtoken';
import { TokenPayload } from '../types/token-payload.types';
import { GeneratedTokens } from '../types/generated-tokens.types';
import { jwtConstants } from '../../infra/constants/jwt.constants';
import { UnauthorizedError } from '@/shared/errors/app-error';

export class JwtService {
  private readonly accessTokenSecret = jwtConstants.accessTokenSecret;
  private readonly refreshTokenSecret = jwtConstants.refreshTokenSecret;
  private readonly accessTokenExpiresIn = jwtConstants.accessTokenExpiresIn;
  private readonly refreshTokenExpiresIn = jwtConstants.refreshTokenExpiresIn;

  generateTokens(payload: TokenPayload): GeneratedTokens {
    const accessToken = this.signToken(
      payload,
      this.accessTokenSecret,
      this.accessTokenExpiresIn
    );

    const refreshToken = this.signToken(
      payload,
      this.refreshTokenSecret,
      this.refreshTokenExpiresIn
    );

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): TokenPayload {
    return this.verifyToken(token, this.accessTokenSecret);
  }

  verifyRefreshToken(token: string): TokenPayload {
    return this.verifyToken(token, this.refreshTokenSecret);
  }

  private signToken(
    payload: TokenPayload,
    secret: string,
    expiresIn: string,
  ): string {
    const options: SignOptions = {
      expiresIn: expiresIn as unknown as (number | jwt.SignOptions['expiresIn']),
      algorithm: 'HS256',
    };

    return jwt.sign(payload, secret, options);
  }

  private verifyToken(token: string, secret: string): TokenPayload {
    try {
      const options: VerifyOptions = {
        algorithms: ['HS256'],
      };

      const decoded = jwt.verify(token, secret, options) as
        | TokenPayload
        | JwtPayload;

      if (typeof decoded === 'string') {
        throw new Error('Invalid token');
      }

      return decoded as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError(
          error instanceof Error ? error.message : 'Token has expired'
        );
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError(
          error instanceof Error ? error.message : 'Invalid token'
        );
      }
      throw error;
    }
  }
}