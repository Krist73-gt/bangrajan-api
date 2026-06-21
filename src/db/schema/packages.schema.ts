import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

export const packages = pgTable('packages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(), // "1x Visit", "4x Sebulan", "8x Ladies"
  category: text('category').notNull(), // "Pelajar" | "Dewasa" | "Private"
  defaultSessions: integer('default_sessions').notNull(), // 1, 4, 8, 26
  validityDays: integer('validity_days').notNull().default(30),
  price: integer('price').notNull(), // Harga dalam rupiah (tanpa desimal)
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
