import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTechnicianReviewDto } from './dto/create-technician-review.dto';
import { UpdateTechnicianReviewDto } from './dto/update-technician-review.dto';

@Injectable()
export class TechnicianReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTechnicianReviewDto: CreateTechnicianReviewDto) {
    return this.prisma.technicianReview.create({
      data: createTechnicianReviewDto,
    });
  }

  async findAll() {
    return this.prisma.technicianReview.findMany();
  }

  async findOne(id: number) {
    const TechnicianReview = await this.prisma.technicianReview.findUnique({ where: { id } });
    if (!TechnicianReview) {
      throw new NotFoundException(`TechnicianReview with ID ${id} not found`);
    }
    return TechnicianReview;
  }

  async update(id: number, updateTechnicianReviewDto: UpdateTechnicianReviewDto) {
    const TechnicianReview = await this.prisma.technicianReview.findUnique({ where: { id } });
    if (!TechnicianReview) {
      throw new NotFoundException(`TechnicianReview with ID ${id} not found`);
    }

    return this.prisma.technicianReview.update({
      where: { id },
      data: updateTechnicianReviewDto,
    });
  }

  async remove(id: number) {
    const TechnicianReview = await this.prisma.technicianReview.findUnique({ where: { id } });
    if (!TechnicianReview) {
      throw new NotFoundException(`TechnicianReview with ID ${id} not found`);
    }

    return this.prisma.technicianReview.delete({ where: { id } });
  }
}
