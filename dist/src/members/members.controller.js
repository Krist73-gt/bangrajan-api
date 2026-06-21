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
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe, } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MembersService } from './members.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
let MembersController = class MembersController {
    membersService;
    constructor(membersService) {
        this.membersService = membersService;
    }
    findAll(search, status, page, limit) {
        return this.membersService.findAll({
            search,
            status,
            page: page ? parseInt(page, 10) : 1,
            limit: limit ? parseInt(limit, 10) : 20,
        });
    }
    getExpiringSoon() {
        return this.membersService.getExpiringSoon();
    }
    findOne(id) {
        return this.membersService.findOne(id);
    }
    create(body) {
        return this.membersService.create(body);
    }
    update(id, body) {
        return this.membersService.update(id, body);
    }
    renew(id, body, user) {
        return this.membersService.renewPackage(id, body, user.id);
    }
    adjustSessions(id, body, user) {
        return this.membersService.adjustSessions(id, body, user.id);
    }
    remove(id) {
        return this.membersService.remove(id);
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'List all members (search, filter, paginate)' }),
    __param(0, Query('search')),
    __param(1, Query('status')),
    __param(2, Query('page')),
    __param(3, Query('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "findAll", null);
__decorate([
    Get('expiring-soon'),
    ApiOperation({ summary: 'Get members expiring within 3 days' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "getExpiringSoon", null);
__decorate([
    Get(':id'),
    ApiOperation({ summary: 'Get member detail' }),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "findOne", null);
__decorate([
    Post(),
    ApiOperation({ summary: 'Create new member (admin register)' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "create", null);
__decorate([
    Patch(':id'),
    ApiOperation({ summary: 'Update member profile' }),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "update", null);
__decorate([
    Post(':id/renew'),
    ApiOperation({ summary: 'Renew package (add sessions + extend expiry)' }),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "renew", null);
__decorate([
    Post(':id/adjust-sessions'),
    ApiOperation({ summary: 'Manual add/reduce sessions' }),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "adjustSessions", null);
__decorate([
    Delete(':id'),
    ApiOperation({ summary: 'Delete member profile' }),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "remove", null);
MembersController = __decorate([
    ApiTags('Members'),
    Controller('api/members'),
    UseGuards(AuthGuard, RolesGuard),
    Roles('admin'),
    __metadata("design:paramtypes", [MembersService])
], MembersController);
export { MembersController };
//# sourceMappingURL=members.controller.js.map