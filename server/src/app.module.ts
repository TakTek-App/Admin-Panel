import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceModule } from './service/service.module';
import { CompanyModule } from './company/company.module';
import { TechnicianModule } from './technician/technician.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { CompanyReviewModule } from './company-review/company-review.module';
import { TechnicianReviewModule } from './technician-review/technician-review.module';
import { UserReviewModule } from './user-review/user-review.module';
import { AgentModule } from './agent/agent.module';
import { CallModule } from './call/call.module';
import { JobModule } from './job/job.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ServiceModule, UserModule, CompanyModule, TechnicianModule, CategoryModule, CompanyReviewModule, TechnicianReviewModule, UserReviewModule, AgentModule, CallModule, JobModule, MailModule],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}