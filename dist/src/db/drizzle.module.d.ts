import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema/index.js';
export declare const DRIZZLE: unique symbol;
export type DrizzleDB = ReturnType<typeof drizzle<typeof schema>>;
export declare class DrizzleModule {
}
