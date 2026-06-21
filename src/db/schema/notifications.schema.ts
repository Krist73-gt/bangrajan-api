import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './auth.schema.js';

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(), // "warning" | "info" | "promo"
  isRead: boolean('is_read').notNull().default(false),
  relatedEntityId: integer('related_entity_id'), // optional FK
  relatedEntityType: text('related_entity_type'), // "announcement" | "checkin" | "membership"
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
