import { pgTable, serial, text, integer, boolean, timestamp, } from 'drizzle-orm/pg-core';
export const packages = pgTable('packages', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    category: text('category').notNull(),
    defaultSessions: integer('default_sessions').notNull(),
    validityDays: integer('validity_days').notNull().default(30),
    price: integer('price').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
//# sourceMappingURL=packages.schema.js.map