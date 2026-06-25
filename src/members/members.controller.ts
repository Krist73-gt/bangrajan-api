import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MembersService } from './members.service.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthUser } from '../auth/guards/auth.guard.js';

@ApiTags('Members')
@Controller('api/members')
@UseGuards(AuthGuard, RolesGuard)
@Roles('admin')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @ApiOperation({ summary: 'List all members (search, filter, paginate)' })
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.membersService.findAll({
      search,
      status,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }

  @Get('expiring-soon')
  @ApiOperation({ summary: 'Get members expiring within 3 days' })
  getExpiringSoon() {
    return this.membersService.getExpiringSoon();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get member detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.findOne(id);
  }

  @Get(':id/activity')
  @ApiOperation({ summary: 'Get member activity history (audit log)' })
  getActivityHistory(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.getActivityHistory(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new member (admin register)' })
  create(
    @Body()
    body: {
      fullName: string;
      phone?: string;
      packageId: number;
      expiryDate: string;
      remainingSessions: number;
    },
  ) {
    return this.membersService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update member profile' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<{ fullName: string; phone: string }>,
  ) {
    return this.membersService.update(id, body);
  }

  @Post(':id/renew')
  @ApiOperation({ summary: 'Renew package (add sessions + extend expiry)' })
  renew(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { packageId: number },
    @CurrentUser() user: AuthUser,
  ) {
    return this.membersService.renewPackage(id, body, user.id);
  }



  @Delete(':id')
  @ApiOperation({ summary: 'Delete member profile' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.remove(id);
  }
}
