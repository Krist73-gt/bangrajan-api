import { Controller, All, Req, Res, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { createAuth } from '../config/auth.config.js';
import { MembersService } from '../members/members.service.js';

@Controller('api/auth')
export class AuthController implements OnModuleInit {
  private auth!: ReturnType<typeof createAuth>;

  constructor(
    private readonly configService: ConfigService,
    private readonly membersService: MembersService,
  ) {}

  onModuleInit() {
    this.auth = createAuth(
      this.configService.get<string>('DATABASE_URL')!,
      this.configService.get<string>('BETTER_AUTH_URL')!,
      this.configService.get<string>('BETTER_AUTH_SECRET')!,
    );
  }

  /**
   * Proxy all /api/auth/* requests to Better Auth handler.
   * Better Auth handles its own routing internally.
   */
  @All('*path')
  async handleAuth(@Req() req: Request, @Res() res: Response): Promise<void> {
    // Convert Express request to Web Request
    const protocol = req.protocol;
    const host = req.get('host') || 'localhost:3001';
    
    // WORKAROUND: better-auth client calls /forget-password but backend expects /request-password-reset
    let originalUrl = req.originalUrl;
    if (originalUrl.includes('/forget-password')) {
      originalUrl = originalUrl.replace('/forget-password', '/request-password-reset');
    }
    
    const url = new URL(originalUrl, `${protocol}://${host}`);

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else {
          headers.set(key, value);
        }
      }
    }

    console.log(`[AuthController] Proxying ${req.method} ${url.toString()}`);
    if (req.body) {
      console.log(`[AuthController] Body:`, JSON.stringify(req.body));
    }

    const webRequest = new globalThis.Request(url.toString(), {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method)
        ? undefined
        : JSON.stringify(req.body),
    });

    let response: any;
    try {
      response = await this.auth!.handler(webRequest);
      console.log(`[AuthController] Response status: ${response.status}`);
    } catch (err: any) {
      console.error('[AuthController] Error in better-auth handler:', err);
      throw err;
    }

    // Convert Web Response to Express response
    response.headers.forEach((value: string, key: string) => {
      res.setHeader(key, value);
    });

    res.status(response.status);

    const body = await response.text();

    // INTERCEPT SUCCESSFUL SIGN-UPS
    try {
      if (
        req.originalUrl.includes('/api/auth/sign-up/email') &&
        req.method === 'POST' &&
        response.status === 200
      ) {
        const parsedBody = JSON.parse(body);
        if (parsedBody && parsedBody.user && parsedBody.user.id) {
          console.log(
            '[AuthController] Intercepted new user sign up:',
            parsedBody.user.id,
          );
          // Jalankan async agar tidak menahan response API
          this.membersService
            .createPendingProfileForNewUser(parsedBody.user)
            .catch((err) => {
              console.error(
                '[AuthController] Failed to auto-create profile:',
                err,
              );
            });
        }
      }
    } catch (err) {
      console.error('[AuthController] Interceptor error:', err);
    }

    res.send(body);
  }
}
