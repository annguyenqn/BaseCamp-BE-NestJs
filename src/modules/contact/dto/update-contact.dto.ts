import { PartialType } from '@nestjs/mapped-types';
import { CreateContactDto } from './create-contact.dto';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateContactDto extends PartialType(CreateContactDto) {
  @IsEmail()
  @IsOptional()
  @ApiProperty({ description: 'Id user', example: 1 })
  userId: number;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ description: 'Email of user', example: 'example@example.com' })
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  @MaxLength(10)
  @ApiProperty({ description: 'Phone number of user', example: '01238541235' })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Tax code of user', example: '23193192321' })
  taxCode: string;
}
