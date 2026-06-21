import { type DrizzleDB } from '../db/drizzle.module.js';
export declare class NotificationsService {
    private db;
    constructor(db: DrizzleDB);
    findByUserId(userId: string): Promise<{
        id: number;
        userId: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
        relatedEntityId: number | null;
        relatedEntityType: string | null;
        createdAt: Date;
    }[]>;
    markAsRead(id: number, userId: string): Promise<{
        id: number;
        userId: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
        relatedEntityId: number | null;
        relatedEntityType: string | null;
        createdAt: Date;
    }>;
    markAllAsRead(userId: string): Promise<{
        message: string;
    }>;
    createNotification(data: {
        userId: string;
        title: string;
        message: string;
        type: string;
        relatedEntityId?: number;
        relatedEntityType?: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        userId: string;
        title: string;
        type: string;
        message: string;
        isRead: boolean;
        relatedEntityId: number | null;
        relatedEntityType: string | null;
    }>;
}
