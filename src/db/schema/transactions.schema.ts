import {
  pgTable,
  serial,
  text,
  integer,
  date,
  timestamp,
} from 'drizzle-orm/pg-core';
import { memberProfiles } from './members.schema.js';
import { packages } from './packages.schema.js';
import { user } from './auth.schema.js';

export const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  memberProfileId: integer('member_profile_id')
    .notNull()
    .references(() => memberProfiles.id, { onDelete: 'cascade' }),
  packageId: integer('package_id').references(() => packages.id, {
    onDelete: 'set null',
  }),
  actionType: text('action_type').notNull(), // "renew" | "add_session" | "reduce_session"
  sessionsDelta: integer('sessions_delta').notNull().default(0), // +8, +1, -1
  previousExpiry: date('previous_expiry'),
  newExpiry: date('new_expiry'),
  notes: text('notes'),
  createdBy: text('created_by').references(() => user.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
