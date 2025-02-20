import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    IsPhoneNumber,
    IsPostalCode,
    IsNumber,
    Min,
    IsArray,
    ArrayNotEmpty,
    IsInt,
  } from 'class-validator';
  
  export class CreateCompanyDto {
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsPhoneNumber()
    phone: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;
  
    @IsNotEmpty()
    @IsString()
    address: string;
  
    @IsNotEmpty()
    @IsString()
    city: string;
  
    @IsNotEmpty()
    @IsPostalCode()
    zipCode: string;
  
    @IsOptional()
    @IsString()
    businessReg?: string;
  
    @IsOptional()
    @IsString()
    driverLicense?: string;
  
    @IsOptional()
    @IsString()
    driverLicenseExpDate?: string;
  
    @IsOptional()
    @IsString()
    insurance?: string;
  
    @IsOptional()
    @IsString()
    insuranceExpDate?: string;

    @IsOptional()
    @IsString()
    license?: string;
  
    @IsOptional()
    @IsNumber()
    @Min(0)
    amountDue?: number;

    @IsOptional()
    @IsString()
    customerId?: string;

    @IsOptional()
    @IsString()
    lastPaymentDate?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    lastChargedCalls?: number;
  
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    services: number[];
  }
  