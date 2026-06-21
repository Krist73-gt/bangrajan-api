var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DrizzleModule } from './db/drizzle.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PackagesModule } from './packages/packages.module.js';
import { MembersModule } from './members/members.module.js';
import { CheckinsModule } from './checkins/checkins.module.js';
import { AnnouncementsModule } from './announcements/announcements.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { WebsiteModule } from './website/website.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            ServeStaticModule.forRoot({
                rootPath: join(process.cwd(), 'uploads'),
                serveRoot: '/uploads',
            }),
            DrizzleModule,
            AuthModule,
            PackagesModule,
            MembersModule,
            CheckinsModule,
            AnnouncementsModule,
            NotificationsModule,
            DashboardModule,
            ReportsModule,
            WebsiteModule,
        ],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map