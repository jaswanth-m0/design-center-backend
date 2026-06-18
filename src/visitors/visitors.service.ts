import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { FollowUpDto } from './dto/follow-up.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';

@Injectable()
export class VisitorsService {
  private static NEXT_STAGE: Record<string, string> = {
    new: 'contacted',
    contacted: 'consultation',
    consultation: 'won',
  };

  constructor(private prisma: PrismaService) {}

  findByHostess(hostessId: string) {
    return this.prisma.visitor.findMany({
      where: { hostessId },
      orderBy: { createdAt: 'desc' },
      include: { timelineEvents: { orderBy: { timestamp: 'asc' } } },
    });
  }

  async findOne(id: string) {
    const v = await this.prisma.visitor.findUnique({
      where: { id },
      include: { timelineEvents: { orderBy: { timestamp: 'asc' } } },
    });
    if (!v) throw new NotFoundException('Visitor not found');
    return v;
  }

  create(hostessId: string, data: CreateVisitorDto) {
    const { timelineEvents, ...rest } = data as any;
    return this.prisma.visitor.create({ data: { ...rest, hostessId } });
  }

  update(id: string, data: UpdateVisitorDto) {
    const { timelineEvents, id: _id, hostessId, createdAt, updatedAt, ...rest } = data as any;
    return this.prisma.visitor.update({ where: { id }, data: rest });
  }

  addTimelineEvent(visitorId: string, data: { label: string; detail?: string }) {
    return this.prisma.timelineEvent.create({ data: { visitorId, ...data } });
  }

  async followUp(id: string, dto: FollowUpDto) {
    const visitor = await this.prisma.visitor.findUniqueOrThrow({ where: { id } });
    let stage = visitor.stage ?? 'new';
    let lostReason: string | null = visitor.lostReason ?? null;

    if (dto.outcome === 'advance') {
      stage = VisitorsService.NEXT_STAGE[stage] ?? stage; // terminal stays
    } else if (dto.outcome === 'won') {
      stage = 'won';
    } else if (dto.outcome === 'lost') {
      stage = 'lost';
      lostReason = dto.lostReason ?? lostReason;
    }
    // 'note' leaves stage unchanged

    const updated = await this.prisma.visitor.update({
      where: { id },
      data: {
        stage,
        lostReason,
        lastContactedAt: new Date(),
        nextFollowUpAt: dto.nextFollowUpAt ? new Date(dto.nextFollowUpAt) : visitor.nextFollowUpAt,
      },
    });

    await this.prisma.timelineEvent.create({
      data: {
        visitorId: id,
        label: dto.outcome === 'note' ? 'Follow-up note' : `Stage → ${stage}`,
        detail: dto.note ?? undefined,
      },
    });

    return updated;
  }
}
