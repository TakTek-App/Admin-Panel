import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Company } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    try {
      const { password, services, ...companyData } = createCompanyDto;

      const hashedPassword = await bcrypt.hash(password, 10);

      return this.prisma.company.create({
        data: {
          ...companyData,
          password: hashedPassword,
          services: {
            connect: services.map((id) => ({ id })),
          },
        },
        include: { services: true },
      });
    } catch (error) {
      throw new BadRequestException("Please verify your data and try again", error.message);
    }
  }

  async findAll(): Promise<Company[]> {
    return this.prisma.company.findMany({
      include: { services: true, technicians: true },
    });
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: { services: true, technicians: { include: { services:true, reviews: true, jobs: { include: { user: true, technician: true, service: true } }, calls: true } } },
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    try {
      const { services, ...companyData } = updateCompanyDto;

      const company = await this.prisma.company.findUnique({ where: { id } });
      if (!company) {
        throw new NotFoundException(`Company with ID ${id} not found`);
      }

      const serviceUpdateData = services
      ? {
          set: services.map((id) => ({ id })),
        }
      : undefined;

      return this.prisma.company.update({
        where: { id },
        data: {
          ...companyData,
          services: serviceUpdateData,
        },
        include: { services: true, technicians: { include: { services:true, reviews: true, jobs: { include: { user: true, technician: true, service: true } }, calls: true } } },
      });
    } catch (error) {
      throw new BadRequestException("Please verify your data and try again", error.message);
    }
  }

  async remove(id: string): Promise<Company> {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return this.prisma.company.delete({ where: { id } });
  }

  async addServiceToCompany(companyId: string, serviceId: number): Promise<Company> {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    return this.prisma.company.update({
      where: { id: companyId },
      data: {
        services: {
          connect: { id: serviceId },
        },
      },
      include: { services: true, technicians: { include: { services:true, reviews: true, jobs: { include: { user: true, technician: true, service: true } }, calls: true } } },
    });
  }

  async removeServiceFromCompany(companyId: string, serviceId: number): Promise<Company> {
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }

    return this.prisma.company.update({
      where: { id: companyId },
      data: {
        services: {
          disconnect: { id: serviceId },
        },
      },
      include: { services: true, technicians: { include: { services:true, reviews: true, jobs: { include: { user: true, technician: true, service: true } }, calls: true } } },
    });
  }

  async login(email: string, password: string): Promise<Company> {
    const company = await this.prisma.company.findUnique({
      where: { email },
      include: { services: true, technicians: { include: { services:true, reviews: true, jobs: { include: { user: true, technician: true, service: true } }, calls: true } } },
    });

    if (!company) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return company;
  }

  async getCompanyTechnicians(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { technicians: { include: { services:true, reviews: true, jobs: { include: { user: true, technician: true, service: true } }, calls: true } } }
    });
  
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }
  
    return company.technicians;
  }

  async getCompanyJobs(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { 
        technicians: {
          include: { 
            jobs: { include: { user: true, technician: true, service: true } }
          }
        }
      },
    });
  
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }
  
    return company.technicians.flatMap(tech => tech.jobs);
  }

  async getCompanyCalls(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      include: { 
        technicians: {
          include: { calls: { include: { user: true, technician: true } } }
        }
      },
    });
  
    if (!company) {
      throw new NotFoundException(`Company with ID ${companyId} not found`);
    }
  
    return company.technicians.flatMap(tech => tech.calls);
  }
}