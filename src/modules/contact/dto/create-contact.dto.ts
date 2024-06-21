import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateContactDto {
  @IsNumber()
  @ApiProperty({ description: 'Id user', example: 1 })
  userId: number;

  @IsEmail()
  @ApiProperty({ description: 'Email of user', example: 'example@example.com' })
  email: string;

  @IsString()
  @MinLength(10)
  @MaxLength(10)
  @ApiProperty({ description: 'Phone number of user', example: '0123854123' })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Tax code of user', example: '23193192321' })
  taxCode: string;
}
