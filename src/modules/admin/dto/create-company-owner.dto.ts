import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
export class CreateCompanyOwnerDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString({ message: 'First name must be a string' })
  @IsOptional()
  firstName?: string;

  @IsString({ message: 'Last name must be a string' })
  @IsOptional()
  lastName?: string;

  @IsString({ message: 'Status must be a string' })
  @IsNotEmpty({ message: 'Status is required' })
  status: string;

  @IsNumber()
  companyId: number;
}
