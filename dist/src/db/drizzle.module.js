var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';
export const DRIZZLE = Symbol('DRIZZLE');
let DrizzleModule = class DrizzleModule {
};
DrizzleModule = __decorate([
    Global(),
    Module({
        providers: [
            {
                provide: DRIZZLE,
                inject: [ConfigService],
                useFactory: (configService) => {
                    const databaseUrl = configService.get('DATABASE_URL');
                    if (!databaseUrl) {
                        throw new Error('DATABASE_URL is not defined');
                    }
                    const client = postgres(databaseUrl);
                    return drizzle(client, { schema });
                },
            },
        ],
        exports: [DRIZZLE],
    })
], DrizzleModule);
export { DrizzleModule };
//# sourceMappingURL=drizzle.module.js.map