import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { LoginCompanyDto } from './dto/login-company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  async findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }

  @Patch(':companyId/services/:serviceId')
  addServiceToCompany(
    @Param('companyId') companyId: string,
    @Param('serviceId') serviceId: string
  ) {
    const numericServiceId = parseInt(serviceId, 10);
    return this.companyService.addServiceToCompany(companyId, numericServiceId);
  }

  @Delete(':companyId/services/:serviceId')
  removeServiceFromCompany(
    @Param('companyId') companyId: string,
    @Param('serviceId') serviceId: string
  ) {
    const numericServiceId = parseInt(serviceId, 10);
    return this.companyService.removeServiceFromCompany(companyId, numericServiceId);
  }

  @Post('login')
  async login(@Body() loginCompanyDto: LoginCompanyDto) {
    return this.companyService.login(loginCompanyDto.email, loginCompanyDto.password);
  }
}