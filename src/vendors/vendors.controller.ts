import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Controller('vendors')
export class VendorsController {
  constructor(private vendors: VendorsService) {}

  @Get()
  findAll() {
    return this.vendors.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendors.findOne(id);
  }

  @Post(':id/view')
  view(@Param('id') id: string) {
    return this.vendors.incrementView(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() dto: CreateVendorDto) {
    return this.vendors.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateVendorDto,
    @Request() req: { user: { id: string; role: string } },
  ) {
    return this.vendors.update(id, dto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.vendors.remove(id);
  }
}
