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
import { Inject, Injectable } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DRIZZLE } from '../db/drizzle.module.js';
import { notifications } from '../db/schema/index.js';
let NotificationsService = class NotificationsService {
    db;
    constructor(db) {
        this.db = db;
    }
    async findByUserId(userId) {
        return this.db
            .select()
            .from(notifications)
            .where(eq(notifications.userId, userId))
            .orderBy(desc(notifications.createdAt))
            .limit(20);
    }
    async markAsRead(id, userId) {
        const [updated] = await this.db
            .update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.id, id))
            .returning();
        return updated;
    }
    async markAllAsRead(userId) {
        await this.db
            .update(notifications)
            .set({ isRead: true })
            .where(eq(notifications.userId, userId));
        return { message: 'Semua notifikasi ditandai sudah dibaca.' };
    }
    async createNotification(data) {
        const [created] = await this.db
            .insert(notifications)
            .values(data)
            .returning();
        return created;
    }
};
NotificationsService = __decorate([
    Injectable(),
    __param(0, Inject(DRIZZLE)),
    __metadata("design:paramtypes", [Object])
], NotificationsService);
export { NotificationsService };
//# sourceMappingURL=notifications.service.js.map