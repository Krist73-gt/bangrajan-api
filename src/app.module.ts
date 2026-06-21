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

@Module({
  imports: [
    // Config — loads .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Serve Static Files
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // Database
    DrizzleModule,

    // Feature Modules
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
export class AppModule {}
