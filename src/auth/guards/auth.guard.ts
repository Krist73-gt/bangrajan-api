import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { getAuth } from '../../config/auth.config.js';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  image?: string | null;
}

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const auth = getAuth();

    try {
      // Build headers from Express request
      const headers = new Headers();
      for (const [key, value] of Object.entries(request.headers)) {
        if (value) {
          if (Array.isArray(value)) {
            value.forEach((v) => headers.append(key, v));
          } else {
            headers.set(key, value);
          }
        }
      }

      const session = await auth.api.getSession({ headers });

      if (!session || !session.user) {
        throw new UnauthorizedException(
          'Sesi tidak valid. Silakan login kembali.',
        );
      }

      // Attach user to request for downstream use
      (request as any).user = session.user;
      (request as any).session = session.session;

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException(
        'Sesi tidak valid. Silakan login kembali.',
      );
    }
  }
}
