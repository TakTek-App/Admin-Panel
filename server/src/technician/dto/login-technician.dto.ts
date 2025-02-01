import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginTechnicianDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}