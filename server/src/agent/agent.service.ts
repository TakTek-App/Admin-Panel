// agent.service.ts
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import * as bcrypt from 'bcrypt';
import { Agent } from '@prisma/client';

@Injectable()
export class AgentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAgentDto: CreateAgentDto) {
    try {
      const { password, ...agentData } = createAgentDto;
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      return this.prisma.agent.create({
        data: {
          ...agentData,
          password: hashedPassword,
        },
        include: { company: true },
      });
    } catch (error) {
      throw new BadRequestException("Please verify your data and try again", error.message);
    }
  }

  async findAll(): Promise<Agent[]> {
    return this.prisma.agent.findMany({
      include: { company: true },
    });
  }

  async findOne(id: number): Promise<Agent> {
    return this.prisma.agent.findUnique({
      where: { id },
      include: { company: true },
    });
  }

  async update(id: number, updateAgentDto: UpdateAgentDto): Promise<Agent> {
    return this.prisma.agent.update({
      where: { id },
      data: updateAgentDto,
      include: { company: true },
    });
  }

  async remove(id: number): Promise<Agent> {
    return this.prisma.agent.delete({
      where: { id },
    });
  }

  async login(email: string, password: string): Promise<Agent> {
      const agent = await this.prisma.agent.findUnique({
        where: { email },
        include: { company: true },
      });
  
      if (!agent) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      const isPasswordValid = await bcrypt.compare(password, agent.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      return agent;
    }
}
