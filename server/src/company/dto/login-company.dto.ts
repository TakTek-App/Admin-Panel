import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginCompanyDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}