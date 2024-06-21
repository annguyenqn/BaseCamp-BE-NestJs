import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateCompanyDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ description: 'Name of company', example: 'FLC' })
  name: string;

  @IsString()
  @IsEmail()
  @IsOptional()
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
