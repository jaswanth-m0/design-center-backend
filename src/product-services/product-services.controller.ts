import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { PrismaService } from '../prisma/prisma.service';
import { ProductServicesService } from './product-services.service';

@Controller('services')
export class ProductServicesController {
  constructor(
    private services: ProductServicesService,
    private prisma: PrismaService,
  ) {}

  @Get()
  findAll() {
    return this.services.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.services.findOne(id);
  }

  // Partner self-service: attach/detach the caller's own vendor to a service.
  // The vendor is resolved from the caller's profile — clients cannot target
  // another vendor.
  @Post(':id/vendor-link')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('partner', 'admin')
  async vendorLink(
    @Param('id') id: string,
    @Body() body: { attach: boolean },
    @Request() req: { user: { id: string } },
  ) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: req.user.id },
      select: { vendorId: true },
    });
    if (!profile?.vendorId) {
      throw new ForbiddenException('No vendor is linked to your account');
    }
    return this.services.linkVendor(id, profile.vendorId, !!body.attach);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() body: any) {
    return this.services.create(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() body: any) {
    return this.services.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.services.remove(id);
  }
}
