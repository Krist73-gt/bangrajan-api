import { NotificationsService } from './notifications.service.js';
import type { AuthUser } from '../auth/guards/auth.guard.js';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: AuthUser): Promise<{
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
    markAsRead(id: number, user: AuthUser): Promise<{
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
    markAllAsRead(user: AuthUser): Promise<{
        message: string;
    }>;
}
