export interface JwtConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

export const jwtConstants: JwtConfig = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'access-secret',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};