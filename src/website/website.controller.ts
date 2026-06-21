import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { WebsiteService } from './website.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiTags('Website')
@Controller('api/website')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  // ─── Stats (Public) ─────────────────────────────────────────────

  @Get('stats')
  @ApiOperation({ summary: 'Get general website stats (public)' })
  getWebsiteStats() {
    return this.websiteService.getWebsiteStats();
  }

  // ─── Schedules ──────────────────────────────────────────────────

  @Get('schedules')
  @ApiOperation({ summary: 'Get all schedules (public)' })
  getSchedules() {
    return this.websiteService.getSchedules();
  }

  @Put('schedules')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Bulk update schedules (admin)' })
  updateSchedules(
    @Body()
    body: Array<{
      id: number;
      openTime: string | null;
      closeTime: string | null;
      isHoliday: boolean;
    }>,
  ) {
    return this.websiteService.updateSchedules(body);
  }

  // ─── Gallery ────────────────────────────────────────────────────

  @Get('gallery')
  @ApiOperation({ summary: 'Get active gallery images (public)' })
  getGalleryImages() {
    return this.websiteService.getGalleryImages();
  }

  @Post('gallery')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('file', {
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
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Add gallery image (admin)' })
  async addGalleryImage(
    @Body() body: { title: string; sortOrder?: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) throw new BadRequestException('Image file is required');
      const imageUrl = `/uploads/gallery/${file.filename}`;
      const sortOrder = body.sortOrder ? parseInt(body.sortOrder, 10) : 0;
      return await this.websiteService.addGalleryImage({
        title: body.title,
        imageUrl,
        sortOrder,
      });
    } catch (error: any) {
      console.error('ADD GALLERY ERROR:', error);
      throw new BadRequestException(error.message || 'Error occurred');
    }
  }

  @Patch('gallery/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(
    FileInterceptor('file', {
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
          return cb(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update gallery image (admin)' })
  async updateGalleryImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{ title: string; sortOrder: string }>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      const updateData: any = {};
      if (body.title) updateData.title = body.title;
      if (body.sortOrder) updateData.sortOrder = parseInt(body.sortOrder, 10);
      if (file) {
        updateData.imageUrl = `/uploads/gallery/${file.filename}`;
      }
      return await this.websiteService.updateGalleryImage(id, updateData);
    } catch (error: any) {
      console.error('UPDATE GALLERY ERROR:', error);
      throw new BadRequestException(error.message || 'Error occurred');
    }
  }

  @Delete('gallery/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove gallery image (admin)' })
  removeGalleryImage(@Param('id', ParseIntPipe) id: number) {
    return this.websiteService.removeGalleryImage(id);
  }
}
