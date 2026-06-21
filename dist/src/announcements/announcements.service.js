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
import { eq, desc } from 'drizzle-orm';
import { DRIZZLE } from '../db/drizzle.module.js';
import { announcements } from '../db/schema/index.js';
let AnnouncementsService = class AnnouncementsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async findAll(onlyActive = true) {
        const query = this.db.select().from(announcements);
        if (onlyActive) {
            return query
                .where(eq(announcements.isActive, true))
                .orderBy(desc(announcements.createdAt));
        }
        return query.orderBy(desc(announcements.createdAt));
    }
    async findOne(id) {
        const [item] = await this.db
            .select()
            .from(announcements)
            .where(eq(announcements.id, id))
            .limit(1);
        if (!item)
            throw new NotFoundException('Pengumuman tidak ditemukan.');
        return item;
    }
    async create(data) {
        const [created] = await this.db
            .insert(announcements)
            .values({
            title: data.title,
            content: data.content,
            type: data.type || 'Info',
            createdBy: data.createdBy,
        })
            .returning();
        return created;
    }
    async update(id, data) {
        const [updated] = await this.db
            .update(announcements)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(announcements.id, id))
            .returning();
        if (!updated)
            throw new NotFoundException('Pengumuman tidak ditemukan.');
        return updated;
    }
    async remove(id) {
        const [deleted] = await this.db
            .delete(announcements)
            .where(eq(announcements.id, id))
            .returning();
        if (!deleted)
            throw new NotFoundException('Pengumuman tidak ditemukan.');
        return { message: 'Pengumuman berhasil dihapus.' };
    }
};
AnnouncementsService = __decorate([
    Injectable(),
    __param(0, Inject(DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], AnnouncementsService);
export { AnnouncementsService };
//# sourceMappingURL=announcements.service.js.map