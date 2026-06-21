import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

// ─── Schedules ───────────────────────────────────────────────────
export const schedules = pgTable('schedules', {
  id: serial('id').primaryKey(),
  dayName: text('day_name').notNull(), // "Senin", "Selasa", ...
  dayOrder: integer('day_order').notNull(), // 0=Senin, 1=Selasa, ..., 6=Minggu
  openTime: text('open_time'), // "09:00" or null (LIBUR)
  closeTime: text('close_time'), // "21:00" or null
  isHoliday: boolean('is_holiday').notNull().default(false),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ─── Gallery Images ──────────────────────────────────────────────
export const galleryImages = pgTable('gallery_images', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  imageUrl: text('image_url').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
