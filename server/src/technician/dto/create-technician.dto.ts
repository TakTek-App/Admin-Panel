import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    IsBoolean,
    IsArray,
    ArrayNotEmpty,
    IsInt,
  } from 'class-validator';
  
  export class CreateTechnicianDto {
    @IsNotEmpty()
    @IsString()
    firstName: string;
  
    @IsNotEmpty()
    @IsString()
    lastName: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;
  
    @IsOptional()
    @IsString()
    photo?: string;
  
    @IsNotEmpty()
    @IsUUID()
    companyId: string;
  
    @IsOptional()
    @IsBoolean()
    verified?: boolean;

    @IsOptional()
    @IsString()
    license?: string;

    @IsOptional()
    @IsString()
    licenseExpDate?: string;
  
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    services: number[];
  }