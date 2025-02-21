import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private mailService: MailService) {}

  // Register a new user
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      include: { reviews: true, calls: true, jobs: { include: { user: true, technician: { include: { company: true } }, service: true, UserReview: true, TechnicianReview: true } } },
    });

    await this.mailService.sendVerificationEmail(newUser.email, newUser.id);

    return newUser;
  }

  // Find all users
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: { reviews: true, calls: true, jobs: { include: { user: true, technician: { include: { company: true } }, service: true, UserReview: true, TechnicianReview: true } } },
    });
  }

  // Find a user by ID
  async findOne(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { reviews: true, calls: true, jobs: { include: { user: true, technician: { include: { company: true } }, service: true, UserReview: true, TechnicianReview: true } } },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Update user details
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: { reviews: true, calls: true, jobs: { include: { user: true, technician: { include: { company: true } }, service: true, UserReview: true, TechnicianReview: true } } },
    });
  }

  // Remove a user
  async remove(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.prisma.user.delete({ where: { id } });
  }

  // Login a user by verifying their credentials
  async login(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { reviews: true, calls: true, jobs: { include: { user: true, technician: { include: { company: true } }, service: true, UserReview: true, TechnicianReview: true } } },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async createCall(userId: number, technicianId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const technician = await this.prisma.technician.findUnique({ where: { id: technicianId } });
    if (!technician) {
      throw new NotFoundException(`Technician with ID ${technicianId} not found`);
    }

    await this.prisma.call.create({
      data: {
        userId,
        technicianId,
      },
    });

    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { reviews: true, calls: true, jobs: { include: { user: true, technician: { include: { company: true } }, service: true, UserReview: true, TechnicianReview: true } } },
    });
  }

  async review(technicianId: number, jobId: number, rating: number) {
    const technician = await this.prisma.technician.findUnique({ where: { id: technicianId } });
    if (!technician) {
      throw new NotFoundException(`Technician with ID ${technicianId} not found`);
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

    await this.prisma.technicianReview.create({
      data: {
        technicianId,
        jobId,
        rating,
      },
    });

    const reviews = await this.prisma.technicianReview.findMany({
      where: { technicianId },
    });

    const newRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    await this.prisma.technician.update({
      where: { id: technicianId },
      data: { rating: newRating },
    });
  
    return { message: "Review added and rating updated", newRating };
  }

  async verifyUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
  
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.verified) {
      throw new BadRequestException('User is already verified.');
    }
  
    return this.prisma.user.update({
      where: { id },
      data: { verified: true },
    });
  }
}