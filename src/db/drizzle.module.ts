import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

export const DRIZZLE = Symbol('DRIZZLE');

export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (!databaseUrl) {
          throw new Error('DATABASE_URL is not defined');
        }
        const client = postgres(databaseUrl, {
          connection: {
            timezone: 'Asia/Jakarta' // Pastikan database mencatat waktu sebagai WIB
          },
          // Paksa postgres.js mem-parsing timestamp (tipe 1114) menjadi Date dengan offset +07:00
          // Ini memotong bug Date() bawaan Node.js yang mengambil zona waktu OS (UTC)
          types: {
            timestamp: {
              to: 1114,
              from: [1114],
              serialize: (x: any) => (x instanceof Date ? x.toISOString() : x),
              parse: (x: any) => new Date(x + '+07:00')
            }
          }
        });
        return drizzle(client, { schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DrizzleModule {}
