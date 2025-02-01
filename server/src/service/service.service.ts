import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Service } from '@prisma/client';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServiceService {
  constructor(private prisma: PrismaService) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    return this.prisma.service.create({ data: createServiceDto });
  }

  async findAll(): Promise<Service[]> {
    return this.prisma.service.findMany({
      include: { companies: true },
    });
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: { companies: true },
    });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async findByCategoryId(categoryId: number): Promise<Service[]> {
    const services = await this.prisma.service.findMany({
      where: {
        categoryId: categoryId, // Replace 'categoryId' with the actual field name in your schema
      },
      include: { companies: true },
    });
    if (!services || services.length === 0) {
      throw new NotFoundException(`No services found for category ID ${categoryId}`);
    }
    return services;
  }

  async update(id: number, updateServiceDto: UpdateServiceDto): Promise<Service> {
    await this.findOne(id); // Check if the service exists before updating
    return this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });
  }

  async remove(id: number): Promise<Service> {
    await this.findOne(id); // Check if the service exists before deleting
    return this.prisma.service.delete({ where: { id } });
  }
}
