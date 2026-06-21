import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { memberProfiles } from './members.schema.js';
import { user } from './auth.schema.js';

export const checkinLogs = pgTable('checkin_logs', {
  id: serial('id').primaryKey(),
  memberProfileId: integer('member_profile_id')
    .notNull()
    .references(() => memberProfiles.id, { onDelete: 'cascade' }),
  checkinTime: timestamp('checkin_time').notNull().defaultNow(),
  status: text('status').notNull(), // "Berhasil" | "Gagal"
  sessionType: text('session_type'), // "Sesi Pagi" | "Sesi Sore"
  sessionsBeforeCheckin: integer('sessions_before_checkin'), // snapshot
  sessionsAfterCheckin: integer('sessions_after_checkin'), // snapshot
  remarks: text('remarks'),
  createdBy: text('created_by').references(() => user.id), // Admin who processed
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
