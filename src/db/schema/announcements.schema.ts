import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth.schema.js';

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: text('type').notNull().default('Info'), // "Info" | "Promo"
  isActive: boolean('is_active').notNull().default(true),
  createdBy: text('created_by').references(() => user.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
