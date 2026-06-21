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
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ParseIntPipe, } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
let AnnouncementsController = class AnnouncementsController {
    announcementsService;
    constructor(announcementsService) {
        this.announcementsService = announcementsService;
    }
    findAll() {
        return this.announcementsService.findAll(true);
    }
    findOne(id) {
        return this.announcementsService.findOne(id);
    }
    create(body, user) {
        return this.announcementsService.create({
            ...body,
            createdBy: user.id,
        });
    }
    update(id, body) {
        return this.announcementsService.update(id, body);
    }
    remove(id) {
        return this.announcementsService.remove(id);
    }
};
__decorate([
    Get(),
    UseGuards(AuthGuard),
    ApiOperation({ summary: 'List active announcements (authenticated)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    UseGuards(AuthGuard),
    ApiOperation({ summary: 'Get announcement detail' }),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "findOne", null);
__decorate([
    Post(),
    UseGuards(AuthGuard, RolesGuard),
    Roles('admin'),
    ApiOperation({ summary: 'Create announcement (admin)' }),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "create", null);
__decorate([
    Patch(':id'),
    UseGuards(AuthGuard, RolesGuard),
    Roles('admin'),
    ApiOperation({ summary: 'Update announcement (admin)' }),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "update", null);
__decorate([
    Delete(':id'),
    UseGuards(AuthGuard, RolesGuard),
    Roles('admin'),
    ApiOperation({ summary: 'Delete announcement (admin)' }),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AnnouncementsController.prototype, "remove", null);
AnnouncementsController = __decorate([
    ApiTags('Announcements'),
    Controller('api/announcements'),
    __metadata("design:paramtypes", [AnnouncementsService])
], AnnouncementsController);
export { AnnouncementsController };
//# sourceMappingURL=announcements.controller.js.map