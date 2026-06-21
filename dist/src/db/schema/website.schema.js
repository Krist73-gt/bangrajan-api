import { pgTable, serial, text, integer, boolean, timestamp, } from 'drizzle-orm/pg-core';
export const schedules = pgTable('schedules', {
    id: serial('id').primaryKey(),
    dayName: text('day_name').notNull(),
    dayOrder: integer('day_order').notNull(),
    openTime: text('open_time'),
    closeTime: text('close_time'),
    isHoliday: boolean('is_holiday').notNull().default(false),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
export const galleryImages = pgTable('gallery_images', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    imageUrl: text('image_url').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});
//# sourceMappingURL=website.schema.js.map