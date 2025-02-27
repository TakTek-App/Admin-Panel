import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Technician } from '@prisma/client';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class TechnicianService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(createTechnicianDto: CreateTechnicianDto): Promise<Technician> {
    try {
      const { companyId, password, services, ...technicianData } =
        createTechnicianDto;

      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        include: { services: true },
      });

      if (!company) {
        throw new NotFoundException(`Company with ID ${companyId} not found`);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const validServiceIds = company.services.map((service) => service.id);
      const invalidServiceIds = services.filter(
        (id) => !validServiceIds.includes(id),
      );

      if (invalidServiceIds.length > 0) {
        throw new BadRequestException(
          `These services do not belong to the company: ${invalidServiceIds.join(', ')}`,
        );
      }

      return this.prisma.technician.create({
        data: {
          ...technicianData,
          password: hashedPassword,
          company: { connect: { id: companyId } },
          services: {
            connect: services.map((id) => ({ id })),
          },
        },
        include: {
          services: true,
          company: { include: { services: true } },
          reviews: true,
          jobs: {
            include: {
              user: true,
              technician: true,
              service: true,
              UserReview: true,
              TechnicianReview: true,
            },
          },
          calls: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Please verify your data and try again',
        error.message,
      );
    }
  }

  async findAll(): Promise<Technician[]> {
    return this.prisma.technician.findMany({
      include: {
        services: true,
        company: { include: { services: true } },
        reviews: true,
        jobs: {
          include: {
            user: true,
            technician: true,
            service: true,
            UserReview: true,
            TechnicianReview: true,
          },
        },
        calls: true,
      },
    });
  }

  async findOne(id: number): Promise<Technician> {
    const technician = await this.prisma.technician.findUnique({
      where: { id },
      include: {
        services: true,
        company: { include: { services: true } },
        reviews: true,
        jobs: {
          include: {
            user: true,
            technician: true,
            service: true,
            UserReview: true,
            TechnicianReview: true,
          },
        },
        calls: true,
      },
    });
    if (!technician) {
      throw new NotFoundException(`Technician with ID ${id} not found`);
    }
    return technician;
  }

  async findByService(serviceId: number): Promise<Technician[]> {
    return this.prisma.technician.findMany({
      where: {
        services: {
          some: { id: serviceId },
        },
      },
      include: {
        services: true,
        company: { include: { services: true } },
        reviews: true,
        jobs: {
          include: {
            user: true,
            technician: true,
            service: true,
            UserReview: true,
            TechnicianReview: true,
          },
        },
        calls: true,
      },
    });
  }

  async update(
    id: number,
    updateTechnicianDto: UpdateTechnicianDto,
  ): Promise<Technician> {
    try {
      const { services, ...technicianData } = updateTechnicianDto;

      const technician = await this.prisma.technician.findUnique({
        where: { id },
        include: {
          services: true,
          company: { include: { services: true } },
          reviews: true,
          jobs: {
            include: {
              user: true,
              technician: true,
              service: true,
              UserReview: true,
              TechnicianReview: true,
            },
          },
          calls: true,
        },
      });

      if (!technician) {
        throw new NotFoundException(`Technician with ID ${id} not found`);
      }

      const { company } = technician;

      if (!company) {
        throw new NotFoundException(
          `Technician with ID ${id} is not associated with a company`,
        );
      }

      if (services) {
        const validServiceIds = company.services.map((service) => service.id);
        const invalidServiceIds = services.filter(
          (id) => !validServiceIds.includes(id),
        );

        if (invalidServiceIds.length > 0) {
          throw new Error(
            `The following service IDs are invalid for this company: ${invalidServiceIds.join(', ')}`,
          );
        }
      }

      const serviceUpdateData = services
        ? {
            set: services.map((id) => ({ id })),
          }
        : undefined;

      return this.prisma.technician.update({
        where: { id },
        data: {
          ...technicianData,
          services: serviceUpdateData,
        },
        include: {
          services: true,
          company: { include: { services: true } },
          reviews: true,
          jobs: {
            include: {
              user: true,
              technician: true,
              service: true,
              UserReview: true,
              TechnicianReview: true,
            },
          },
          calls: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        'Please verify your data and try again',
        error.message,
      );
    }
  }

  async remove(id: number): Promise<Technician> {
    const technician = await this.prisma.technician.findUnique({
      where: { id },
    });
    if (!technician) {
      throw new NotFoundException(`Technician with ID ${id} not found`);
    }
    return this.prisma.technician.delete({ where: { id } });
  }

  async login(email: string, password: string): Promise<Technician> {
    const technician = await this.prisma.technician.findUnique({
      where: { email },
      include: {
        services: true,
        company: { include: { services: true } },
        reviews: true,
        jobs: {
          include: {
            user: true,
            technician: true,
            service: true,
            UserReview: true,
            TechnicianReview: true,
          },
        },
        calls: true,
      },
    });

    if (!technician) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, technician.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return technician;
  }

  async acceptJob(technicianId: number, userId: number, serviceId: number) {
    // Find the technician and ensure they are available
    const technician = await this.prisma.technician.findUnique({
      where: { id: technicianId },
    });

    if (!technician) {
      throw new NotFoundException(
        `Technician with ID ${technicianId} not found`,
      );
    }

    // Ensure the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Create a new job entry
    await this.prisma.job.create({
      data: {
        userId,
        technicianId,
        serviceId,
      },
      include: {
        user: true,
        technician: true,
        service: true,
      },
    });

    return this.prisma.technician.findUnique({
      where: { id: technicianId },
      include: {
        services: true,
        company: { include: { services: true } },
        reviews: true,
        jobs: { include: { user: true, technician: true, service: true } },
        calls: true,
      },
    });
  }

  async createCall(technicianId: number, userId: number) {
    const technician = await this.prisma.technician.findUnique({
      where: { id: technicianId },
    });
    if (!technician) {
      throw new NotFoundException(
        `Technician with ID ${technicianId} not found`,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    await this.prisma.call.create({
      data: {
        technicianId,
        userId,
      },
    });

    return this.prisma.technician.findUnique({
      where: { id: technicianId },
      include: {
        services: true,
        company: { include: { services: true } },
        reviews: true,
        jobs: { include: { user: true, technician: true, service: true } },
        calls: true,
      },
    });
  }

  async review(userId: number, jobId: number, rating: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });
    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    await this.prisma.job.update({
      where: { id: jobId },
      data: { completed: true },
    });

    return this.prisma.userReview.create({
      data: {
        userId,
        jobId,
        rating,
      },
    });
  }

  async changePassword(
    technicianId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    // Find the technician
    const technician = await this.prisma.technician.findUnique({
      where: { id: technicianId },
    });

    if (!technician) {
      throw new NotFoundException(
        `Technician with ID ${technicianId} not found`,
      );
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      technician.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    await this.prisma.technician.update({
      where: { id: technicianId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async forgotPassword(email: string) {
    const technician = await this.prisma.technician.findUnique({
      where: { email },
    });

    if (!technician) {
      throw new NotFoundException('Technician not found');
    }

    await this.mailService.sendForgotPasswordEmail(
      email,
      technician.id,
      'technician',
    );

    return { message: 'Password reset email sent. Check your inbox.' };
  }

  async resetPassword(technicianId: number, role: string, newPassword: string) {
    if (role !== 'technician') {
      throw new UnauthorizedException('Invalid token for technician');
    }

    const technician = await this.prisma.technician.findUnique({
      where: { id: technicianId },
    });

    if (!technician) {
      throw new NotFoundException('Technician not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.technician.update({
      where: { id: technicianId },
      data: { password: hashedPassword },
    });

    return { message: 'Password successfully reset. You can now log in.' };
  }
}
