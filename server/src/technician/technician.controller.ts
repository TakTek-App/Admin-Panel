import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { TechnicianService } from './technician.service';
import { Technician } from '@prisma/client';
import { CreateTechnicianDto } from './dto/create-technician.dto';
import { UpdateTechnicianDto } from './dto/update-technician.dto';
import { LoginTechnicianDto } from './dto/login-technician.dto';
import * as jwt from 'jsonwebtoken';

@Controller('technicians')
export class TechnicianController {
  constructor(private readonly technicianService: TechnicianService) {}

  @Post()
  create(@Body() createTechnicianDto: CreateTechnicianDto) {
    return this.technicianService.create(createTechnicianDto);
  }

  @Get()
  async findAll(): Promise<Technician[]> {
    return this.technicianService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    return this.technicianService.findOne(numericId);
  }

  @Get('service/:serviceId')
  findByService(@Param('serviceId') serviceId: string) {
    const numericId = parseInt(serviceId, 10);
    return this.technicianService.findByService(numericId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTechnicianDto: UpdateTechnicianDto,
  ) {
    const numericId = parseInt(id, 10);
    return this.technicianService.update(numericId, updateTechnicianDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const numericId = parseInt(id, 10);
    return this.technicianService.remove(numericId);
  }

  @Post('login')
  async login(@Body() loginTechnicianDto: LoginTechnicianDto) {
    return this.technicianService.login(
      loginTechnicianDto.email,
      loginTechnicianDto.password,
    );
  }

  @Post('accept-job')
  async acceptJob(
    @Body() body: { technicianId: number; userId: number; serviceId: number },
  ) {
    return this.technicianService.acceptJob(
      body.technicianId,
      body.userId,
      body.serviceId,
    );
  }

  @Post('create-call')
  async createCall(@Body() { technicianId, userId }) {
    return this.technicianService.createCall(technicianId, userId);
  }

  @Post('review')
  async review(@Body() { userId, jobId, rating }) {
    return this.technicianService.review(userId, jobId, rating);
  }

  @Patch(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.technicianService.changePassword(
      Number(id),
      currentPassword,
      newPassword,
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.technicianService.forgotPassword(email);
  }

  @Patch('reset-password')
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    try {
      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: number;
        role: string;
      };

      if (!decoded.id || !decoded.role) {
        throw new UnauthorizedException('Invalid token');
      }

      return this.technicianService.resetPassword(
        decoded.id,
        decoded.role,
        newPassword,
      );
    } catch (error) {
      throw new BadRequestException('Invalid or expired reset token.');
    }
  }
}
