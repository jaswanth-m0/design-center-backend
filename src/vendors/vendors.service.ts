import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.vendor.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const v = await this.prisma.vendor.findUnique({ where: { id } });
    if (!v) throw new NotFoundException('Vendor not found');
    return v;
  }

  create(data: CreateVendorDto) {
    return this.prisma.vendor.create({ data: data as any });
  }

  async update(
    id: string,
    data: UpdateVendorDto,
    requester?: { id: string; role: string },
  ) {
    // Non-admins may only update the vendor their profile is linked to.
    if (requester && requester.role !== 'admin') {
      const profile = await this.prisma.profile.findUnique({
        where: { id: requester.id },
        select: { vendorId: true },
      });
      if (!profile || profile.vendorId !== id) {
        throw new ForbiddenException('You can only manage your own listing');
      }
    }
    return this.prisma.vendor.update({ where: { id }, data: data as any });
  }

  remove(id: string) {
    return this.prisma.vendor.delete({ where: { id } });
  }

  async incrementView(id: string): Promise<{ viewCount: number }> {
    const v = await this.prisma.vendor.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });
    return { viewCount: v.viewCount };
  }
}
