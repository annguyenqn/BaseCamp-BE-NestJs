import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @IsEmail()
  @IsOptional()
  @ApiProperty({ description: 'Email of user', example: 'DemoUser@gmail.com' })
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @ApiProperty({ description: 'Password of user', example: '123456789' })
  password: string;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
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
