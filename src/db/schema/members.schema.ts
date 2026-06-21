import {
  pgTable,
  serial,
  text,
  integer,
  date,
  timestamp,
} from 'drizzle-orm/pg-core';
import { user } from './auth.schema.js';
import { packages } from './packages.schema.js';

export const memberProfiles = pgTable('member_profiles', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => user.id, { onDelete: 'set null' }), // nullable — member mungkin belum buat akun
  packageId: integer('package_id').references(() => packages.id, {
    onDelete: 'set null',
  }),
  memberId: text('member_id').notNull().unique(), // "BR-2026-0042" (barcode ID)
  fullName: text('full_name').notNull(),
  phone: text('phone'), // WhatsApp number
  remainingSessions: integer('remaining_sessions').notNull().default(0),
  expiryDate: date('expiry_date').notNull(),
  status: text('status').notNull().default('Aktif'), // "Aktif" | "Warning" | "Expired"
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
