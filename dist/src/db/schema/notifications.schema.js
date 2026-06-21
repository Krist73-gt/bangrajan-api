import { pgTable, serial, text, integer, boolean, timestamp, } from 'drizzle-orm/pg-core';
import { user } from './auth.schema.js';
export const notifications = pgTable('notifications', {
    id: serial('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    message: text('message').notNull(),
    type: text('type').notNull(),
    isRead: boolean('is_read').notNull().default(false),
    relatedEntityId: integer('related_entity_id'),
    relatedEntityType: text('related_entity_type'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
//# sourceMappingURL=notifications.schema.js.map