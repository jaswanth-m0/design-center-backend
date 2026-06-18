import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, private auth: AuthService) {}

  listUsers(role?: string) {
    return this.prisma.user
      .findMany({
        where: role ? { role: role as any } : undefined,
        include: { profile: true },
        orderBy: { createdAt: 'desc' },
      })
      .then((users) =>
        users.map((u) => ({
          id: u.id,
          email: u.email,
          role: u.role,
          name: u.profile?.name ?? null,
          vendorId: u.profile?.vendorId ?? null,
        })),
      );
  }

  getUser(id: string) {
    return this.auth.me(id);
  }

  createUser(dto: CreateUserDto) {
    return this.auth.createUser(dto);
  }

  linkPartnerVendor(userId: string, vendorId: string) {
    return this.prisma.profile.upsert({
      where: { id: userId },
      create: { id: userId, vendorId },
      update: { vendorId },
    });
  }

  async getStats() {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 6);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      totalVendors,
      totalServices,
      totalVisitors,
      totalConsultations,
      todayVisitors,
      weekVisitors,
      monthVisitors,
      activeLeads,
      pendingConsultations,
      completedConsultations,
      customerCount,
      partnerCount,
      leadsBySource,
      recentVisitors,
      recentConsultations,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.vendor.count(),
      this.prisma.service.count(),
      this.prisma.visitor.count(),
      this.prisma.consultation.count(),
      this.prisma.visitor.count({ where: { createdAt: { gte: todayStart } } }),
      this.prisma.visitor.count({ where: { createdAt: { gte: weekStart } } }),
      this.prisma.visitor.count({ where: { createdAt: { gte: monthStart } } }),
      this.prisma.visitor.count({ where: { tourProgress: { lt: 1 } } }),
      this.prisma.consultation.count({ where: { status: 'upcoming' } }),
      this.prisma.consultation.count({ where: { status: 'completed' } }),
      this.prisma.user.count({ where: { role: 'customer' } }),
      this.prisma.user.count({ where: { role: 'partner' } }),
      this.prisma.visitor.groupBy({ by: ['leadSource'], _count: { id: true } }),
      this.prisma.visitor.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true, fullName: true, city: true, leadSource: true,
          tourProgress: true, createdAt: true, propertyType: true,
          interestedCategories: true,
        },
      }),
      this.prisma.consultation.findMany({
        where: { status: 'upcoming' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { vendor: { select: { name: true } } },
      }),
    ]);

    const conversionRate = totalVisitors > 0
      ? Math.round((completedConsultations / totalVisitors) * 100)
      : 0;

    const leadSourceMap: Record<string, number> = {};
    for (const row of leadsBySource) {
      if (row.leadSource) leadSourceMap[row.leadSource] = row._count.id;
    }

    return {
      overview: {
        totalUsers,
        totalVendors,
        totalServices,
        totalVisitors,
        totalConsultations,
        customerCount,
        partnerCount,
        conversionRate,
      },
      today: { visitors: todayVisitors },
      week: { visitors: weekVisitors },
      month: { visitors: monthVisitors },
      leads: {
        active: activeLeads,
        bySource: leadSourceMap,
      },
      consultations: {
        pending: pendingConsultations,
        completed: completedConsultations,
      },
      recentVisitors,
      recentConsultations,
    };
  }
}
