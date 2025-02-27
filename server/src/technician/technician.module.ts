import { Module } from '@nestjs/common';
import { TechnicianService } from './technician.service';
import { TechnicianController } from './technician.controller';
import { PrismaService } from 'prisma/prisma.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [TechnicianController],
  providers: [TechnicianService, PrismaService],
})
export class TechnicianModule {}
