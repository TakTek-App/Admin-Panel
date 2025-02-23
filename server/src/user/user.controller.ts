import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as jwt from 'jsonwebtoken';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(parseInt(id), updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(parseInt(id));
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto.email, loginUserDto.password);
  }

  @Post('create-call')
  async createCall(@Body() { userId, technicianId }) {
    return this.userService.createCall(userId, technicianId);
  }

  @Post('review')
  async review(@Body() { technicianId, jobId, rating }) {
    return this.userService.review(technicianId, jobId, rating);
  }

  @Patch(':token/verify')
  async verifyUser(@Body('token') token: string, @Res() res: Response) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        userId: number;
      };

      await this.userService.verifyUser(decoded.userId);
      return res.send(`Your account has been successfully verified! ✅`);
    } catch (error) {
      return res.status(400).send(`Error: ${error.message}`);
    }
  }
}
