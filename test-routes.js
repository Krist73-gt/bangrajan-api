import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './src/db/schema/index.js';

const client = postgres('postgresql://postgres:kristo123@localhost:5432/bangrajan');
const db = drizzle(client, { schema });

const authInstance = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  baseURL: 'http://localhost:3001',
  secret: 'some-secret',
  emailAndPassword: {
    enabled: true,
  }
});

console.log("Registered routes:");
console.log(Object.keys(authInstance.api || {}).sort());
process.exit(0);
