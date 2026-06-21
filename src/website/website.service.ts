import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, asc, sql } from 'drizzle-orm';
import * as fs from 'fs';
import { join } from 'path';
import { DRIZZLE, type DrizzleDB } from '../db/drizzle.module.js';
import {
  schedules,
  galleryImages,
  memberProfiles,
} from '../db/schema/index.js';

@Injectable()
export class WebsiteService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  // ─── Stats ──────────────────────────────────────────────────────

  async getWebsiteStats() {
    const [result] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(memberProfiles)
      .where(eq(memberProfiles.status, 'Aktif'));

    return {
      activeMembers: Number(result?.count) || 0,
    };
  }

  // ─── Schedules ──────────────────────────────────────────────────

  async getSchedules() {
    return this.db.select().from(schedules).orderBy(asc(schedules.dayOrder));
  }

  async updateSchedules(
    data: Array<{
      id: number;
      openTime: string | null;
      closeTime: string | null;
      isHoliday: boolean;
    }>,
  ) {
    const results = [];
    for (const item of data) {
      const [updated] = await this.db
        .update(schedules)
        .set({
          openTime: item.openTime,
          closeTime: item.closeTime,
          isHoliday: item.isHoliday,
          updatedAt: new Date(),
        })
        .where(eq(schedules.id, item.id))
        .returning();
      if (updated) results.push(updated);
    }
    return results;
  }

  // ─── Gallery ────────────────────────────────────────────────────

  async getGalleryImages() {
    const images = await this.db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.isActive, true))
      .orderBy(asc(galleryImages.sortOrder));

    // Prepend absolute backend URL so Next.js can display it directly
    const baseUrl = process.env.API_URL || 'http://localhost:3001';
    return images.map((img) => ({
      ...img,
      imageUrl: img.imageUrl.startsWith('/uploads')
        ? `${baseUrl}${img.imageUrl}`
        : img.imageUrl,
    }));
  }

  async addGalleryImage(data: {
    title: string;
    imageUrl: string;
    sortOrder?: number;
  }) {
    const [created] = await this.db
      .insert(galleryImages)
      .values({
        title: data.title,
        imageUrl: data.imageUrl,
        sortOrder: data.sortOrder ?? 0,
      })
      .returning();
    return created;
  }

  async updateGalleryImage(
    id: number,
    data: Partial<{ title: string; imageUrl: string; sortOrder: number }>,
  ) {
    const [updated] = await this.db
      .update(galleryImages)
      .set(data)
      .where(eq(galleryImages.id, id))
      .returning();
    if (!updated) throw new NotFoundException('Gambar galeri tidak ditemukan.');
    return updated;
  }

  async removeGalleryImage(id: number) {
    const [image] = await this.db
      .select()
      .from(galleryImages)
      .where(eq(galleryImages.id, id));

    if (!image) throw new NotFoundException('Gambar galeri tidak ditemukan.');

    // Remove the physical file if it exists
    if (image.imageUrl && image.imageUrl.startsWith('/uploads')) {
      const filePath = join(process.cwd(), image.imageUrl);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error('Failed to delete file:', e);
        }
      }
    }

    await this.db.delete(galleryImages).where(eq(galleryImages.id, id));

    return { message: 'Gambar galeri berhasil dihapus beserta file fisiknya.' };
  }
}
