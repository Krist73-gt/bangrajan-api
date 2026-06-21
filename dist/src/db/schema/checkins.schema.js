import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { memberProfiles } from './members.schema.js';
import { user } from './auth.schema.js';
export const checkinLogs = pgTable('checkin_logs', {
    id: serial('id').primaryKey(),
    memberProfileId: integer('member_profile_id')
        .notNull()
        .references(() => memberProfiles.id, { onDelete: 'cascade' }),
    checkinTime: timestamp('checkin_time').notNull().defaultNow(),
    status: text('status').notNull(),
    sessionType: text('session_type'),
    sessionsBeforeCheckin: integer('sessions_before_checkin'),
    sessionsAfterCheckin: integer('sessions_after_checkin'),
    remarks: text('remarks'),
    createdBy: text('created_by').references(() => user.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
//# sourceMappingURL=checkins.schema.js.map