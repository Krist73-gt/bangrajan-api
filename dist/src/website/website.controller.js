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
import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { WebsiteService } from './website.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
let WebsiteController = class WebsiteController {
    websiteService;
    constructor(websiteService) {
        this.websiteService = websiteService;
    }
    getWebsiteStats() {
        return this.websiteService.getWebsiteStats();
    }
    getSchedules() {
        return this.websiteService.getSchedules();
    }
    updateSchedules(body) {
        return this.websiteService.updateSchedules(body);
    }
    getGalleryImages() {
        return this.websiteService.getGalleryImages();
    }
    async addGalleryImage(body, file) {
        try {
            if (!file)
                throw new BadRequestException('Image file is required');
            const imageUrl = `/uploads/gallery/${file.filename}`;
            const sortOrder = body.sortOrder ? parseInt(body.sortOrder, 10) : 0;
            return await this.websiteService.addGalleryImage({
                title: body.title,
                imageUrl,
                sortOrder,
            });
        }
        catch (error) {
            console.error('ADD GALLERY ERROR:', error);
            throw new BadRequestException(error.message || 'Error occurred');
        }
    }
    async updateGalleryImage(id, body, file) {
        try {
            const updateData = {};
            if (body.title)
                updateData.title = body.title;
            if (body.sortOrder)
                updateData.sortOrder = parseInt(body.sortOrder, 10);
            if (file) {
                updateData.imageUrl = `/uploads/gallery/${file.filename}`;
            }
            return await this.websiteService.updateGalleryImage(id, updateData);
        }
        catch (error) {
            console.error('UPDATE GALLERY ERROR:', error);
            throw new BadRequestException(error.message || 'Error occurred');
        }
    }
    removeGalleryImage(id) {
        return this.websiteService.removeGalleryImage(id);
    }
};
__decorate([
    Get('stats'),
    ApiOperation({ summary: 'Get general website stats (public)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebsiteController.prototype, "getWebsiteStats", null);
__decorate([
    Get('schedules'),
    ApiOperation({ summary: 'Get all schedules (public)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebsiteController.prototype, "getSchedules", null);
__decorate([
    Put('schedules'),
    UseGuards(AuthGuard, RolesGuard),
    Roles('admin'),
    ApiOperation({ summary: 'Bulk update schedules (admin)' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], WebsiteController.prototype, "updateSchedules", null);
__decorate([
    Get('gallery'),
    ApiOperation({ summary: 'Get active gallery images (public)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WebsiteController.prototype, "getGalleryImages", null);
__decorate([
    Post('gallery'),
    UseGuards(AuthGuard, RolesGuard),
    Roles('admin'),
    UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = join(process.cwd(), 'uploads', 'gallery');
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    })),
    ApiConsumes('multipart/form-data'),
    ApiOperation({ summary: 'Add gallery image (admin)' }),
    __param(0, Body()),
    __param(1, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "addGalleryImage", null);
__decorate([
    Patch('gallery/:id'),
    UseGuards(AuthGuard, RolesGuard),
    Roles('admin'),
    UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = join(process.cwd(), 'uploads', 'gallery');
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(null)
                    .map(() => Math.round(Math.random() * 16).toString(16))
                    .join('');
                cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
                return cb(new BadRequestException('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    })),
    ApiConsumes('multipart/form-data'),
    ApiOperation({ summary: 'Update gallery image (admin)' }),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body()),
    __param(2, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], WebsiteController.prototype, "updateGalleryImage", null);
__decorate([
    Delete('gallery/:id'),
    UseGuards(AuthGuard, RolesGuard),
    Roles('admin'),
    ApiOperation({ summary: 'Remove gallery image (admin)' }),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], WebsiteController.prototype, "removeGalleryImage", null);
WebsiteController = __decorate([
    ApiTags('Website'),
    Controller('api/website'),
    __metadata("design:paramtypes", [WebsiteService])
], WebsiteController);
export { WebsiteController };
//# sourceMappingURL=website.controller.js.map