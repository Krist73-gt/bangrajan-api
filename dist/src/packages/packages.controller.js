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
import { PackagesService } from './packages.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
let PackagesController = class PackagesController {
    packagesService;
    constructor(packagesService) {
        this.packagesService = packagesService;
    }
    findAll() {
        return this.packagesService.findAll();
    }
    findOne(id) {
        return this.packagesService.findOne(id);
    }
    create(body) {
        return this.packagesService.create(body);
    }
    update(id, body) {
        return this.packagesService.update(id, body);
    }
    remove(id) {
        return this.packagesService.softDelete(id);
    }
};
__decorate([
    Get(),
    ApiOperation({ summary: 'List all active packages (public)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    UseGuards(AuthGuard, RolesGuard),
    Roles('admin'),
    ApiOperation({ summary: 'Get package detail (admin)' }),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "findOne", null);
__decorate([
    Post(),
    UseGuards(AuthGuard, RolesGuard),
    Roles('admin'),
    ApiOperation({ summary: 'Create new package (admin)' }),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "create", null);
__decorate([
    Patch(':id'),
    UseGuards(AuthGuard, RolesGuard),
    Roles('admin'),
    ApiOperation({ summary: 'Update package (admin)' }),
    __param(0, Param('id', ParseIntPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "update", null);
__decorate([
    Delete(':id'),
    UseGuards(AuthGuard, RolesGuard),
    Roles('admin'),
    ApiOperation({ summary: 'Soft delete package (admin)' }),
    __param(0, Param('id', ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PackagesController.prototype, "remove", null);
PackagesController = __decorate([
    ApiTags('Packages'),
    Controller('api/packages'),
    __metadata("design:paramtypes", [PackagesService])
], PackagesController);
export { PackagesController };
//# sourceMappingURL=packages.controller.js.map