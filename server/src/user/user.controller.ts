import { Controller, Get, Post, Patch, Delete, Param, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

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

  @Get(':id/verify')
  async verifyUser(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.userService.verifyUser(Number(id));
      return res.send(`<h2>Your account has been successfully verified! ✅</h2>`);
    } catch (error) {
      return res.status(400).send(`<h2>Error: ${error.message}</h2>`);
    }
  }
}