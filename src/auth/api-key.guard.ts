import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private config: ConfigService) {}
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const key = req.header('x-api-key') || req.header('X-API-KEY');
    const expected = this.config.get<string>('API_KEY');
    if (!key || key !== expected) {
      throw new UnauthorizedException('Invalid API key');
    }
    return true;
  }
}
