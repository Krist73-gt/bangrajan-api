import { AnnouncementsService } from './announcements.service.js';
import type { AuthUser } from '../auth/guards/auth.guard.js';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    findAll(): Promise<{
        id: number;
        title: string;
        content: string;
        type: string;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        title: string;
        content: string;
        type: string;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(body: {
        title: string;
        content: string;
        type: string;
    }, user: AuthUser): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        createdBy: string | null;
        title: string;
        content: string;
        type: string;
    }>;
    update(id: number, body: Partial<{
        title: string;
        content: string;
        type: string;
        isActive: boolean;
    }>): Promise<{
        id: number;
        title: string;
        content: string;
        type: string;
        isActive: boolean;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
