export class JwtBlacklistService {
  private static blacklistedTokens = new Set<string>();

  static revoke(token: string): void {
    this.blacklistedTokens.add(token);
  }

  static isRevoked(token: string): boolean {
    return this.blacklistedTokens.has(token);
  }
}
