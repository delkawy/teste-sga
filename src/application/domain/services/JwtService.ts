export abstract class JwtService {
  abstract verifyAsync(token: string): Promise<any>;
  abstract signAsync(payload: object): Promise<string>;
}
