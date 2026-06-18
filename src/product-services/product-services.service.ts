import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductServicesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.service.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const s = await this.prisma.service.findUnique({ where: { id } });
    if (!s) throw new NotFoundException('Service not found');
    return s;
  }

  create(data: any) {
    return this.prisma.service.create({ data });
  }

  update(id: string, data: any) {
    return this.prisma.service.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.service.delete({ where: { id } });
  }

  async linkVendor(serviceId: string, vendorId: string, attach: boolean) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      select: { relatedVendorIds: true },
    });
    if (!service) throw new NotFoundException('Service not found');
    const current = service.relatedVendorIds ?? [];
    const next = attach
      ? Array.from(new Set([...current, vendorId]))
      : current.filter((id) => id !== vendorId);
    return this.prisma.service.update({
      where: { id: serviceId },
      data: { relatedVendorIds: next },
    });
  }
}
