import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAccountDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email of user', example: 'example@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: 'Password of user', example: 'password123' })
  password: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Company id to define what is company user belong to',
    example: 1,
  })
  companyId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Name of user', example: 'John' })
  firstName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Last Name of user', example: 'Witch' })
  lastName: string;
}
