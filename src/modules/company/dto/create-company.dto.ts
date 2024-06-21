import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Name of company', example: 'FLC' })
  name: string;

  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'Mail to contact with this company',
    example: 'Flc@gmail.com',
  })
  companyMailbox: string;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date;
}
