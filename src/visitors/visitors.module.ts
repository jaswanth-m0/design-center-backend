import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';

@Module({
  imports: [NotificationsModule],
  controllers: [VisitorsController],
  providers: [VisitorsService],
})
export class VisitorsModule {}
