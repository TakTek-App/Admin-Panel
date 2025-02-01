// src/jobs/jobs.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto) {
    return this.prisma.job.create({
      data: createJobDto,
      include: { user: true, technician: true, service: true }
    });
  }

  async findAll() {
    return this.prisma.job.findMany({
      include: { user: true, technician: true, service: true, UserReview: true, TechnicianReview: true }
    });
  }

  async findOne(id: number) {
    return this.prisma.job.findUnique({
      where: { id },
      include: { user: true, technician: true, service: true, UserReview: true, TechnicianReview: true }
    });
  }

  async update(id: number, updateJobDto: UpdateJobDto) {
    return this.prisma.job.update({
      where: { id },
      data: updateJobDto,
      include: { user: true, technician: true, service: true, UserReview: true, TechnicianReview: true }
    });
  }

  async remove(id: number) {
    return this.prisma.job.delete({
      where: { id },
    });
  }
}
