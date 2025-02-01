// agent.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor,
  } from '@nestjs/common';
  import { AgentService } from './agent.service';
  import { CreateAgentDto } from './dto/create-agent.dto';
  import { UpdateAgentDto } from './dto/update-agent.dto';
import { LoginAgentDto } from './dto/login-agent.dto';
  
  @Controller('agents')
  @UseInterceptors(ClassSerializerInterceptor)
  export class AgentController {
    constructor(private readonly agentService: AgentService) {}
  
    @Post()
    async create(@Body() createAgentDto: CreateAgentDto) {
      const agent = await this.agentService.create(createAgentDto);
      return this.agentService.create(createAgentDto);
    }
  
    @Get()
    async findAll() {
      return this.agentService.findAll();
    }
  
    @Get(':id')
    async findOne(@Param('id') id: string) {
      return this.agentService.findOne(parseInt(id));
    }
  
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() updateAgentDto: UpdateAgentDto,
    ) {
      return this.agentService.update(parseInt(id), updateAgentDto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string) {
      return this.agentService.remove(parseInt(id));
    }

    @Post('login')
    async login(@Body() loginAgentDto: LoginAgentDto) {
      return this.agentService.login(loginAgentDto.email, loginAgentDto.password);
    }
  }
  