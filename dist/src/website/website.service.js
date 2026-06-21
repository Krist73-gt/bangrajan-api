var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, asc, sql } from 'drizzle-orm';
import * as fs from 'fs';
import { join } from 'path';
import { DRIZZLE } from '../db/drizzle.module.js';
import { schedules, galleryImages, memberProfiles, } from '../db/schema/index.js';
let WebsiteService = class WebsiteService {
    db;
    constructor(db) {
        this.db = db;
    }
    async getWebsiteStats() {
        const [result] = await this.db
            .select({ count: sql `count(*)` })
            .from(memberProfiles)
            .where(eq(memberProfiles.status, 'Aktif'));
        return {
            activeMembers: Number(result?.count) || 0,
        };
    }
    async getSchedules() {
        return this.db.select().from(schedules).orderBy(asc(schedules.dayOrder));
    }
    async updateSchedules(data) {
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
            if (updated)
                results.push(updated);
        }
        return results;
    }
    async getGalleryImages() {
        const images = await this.db
            .select()
            .from(galleryImages)
            .where(eq(galleryImages.isActive, true))
            .orderBy(asc(galleryImages.sortOrder));
        const baseUrl = process.env.API_URL || 'http://localhost:3001';
        return images.map((img) => ({
            ...img,
            imageUrl: img.imageUrl.startsWith('/uploads')
                ? `${baseUrl}${img.imageUrl}`
                : img.imageUrl,
        }));
    }
    async addGalleryImage(data) {
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
    async updateGalleryImage(id, data) {
        const [updated] = await this.db
            .update(galleryImages)
            .set(data)
            .where(eq(galleryImages.id, id))
            .returning();
        if (!updated)
            throw new NotFoundException('Gambar galeri tidak ditemukan.');
        return updated;
    }
    async removeGalleryImage(id) {
        const [image] = await this.db
            .select()
            .from(galleryImages)
            .where(eq(galleryImages.id, id));
        if (!image)
            throw new NotFoundException('Gambar galeri tidak ditemukan.');
        if (image.imageUrl && image.imageUrl.startsWith('/uploads')) {
            const filePath = join(process.cwd(), image.imageUrl);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                }
                catch (e) {
                    console.error('Failed to delete file:', e);
                }
            }
        }
        await this.db.delete(galleryImages).where(eq(galleryImages.id, id));
        return { message: 'Gambar galeri berhasil dihapus beserta file fisiknya.' };
    }
};
WebsiteService = __decorate([
    Injectable(),
    __param(0, Inject(DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], WebsiteService);
export { WebsiteService };
//# sourceMappingURL=website.service.js.map