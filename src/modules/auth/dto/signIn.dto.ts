import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email to login', example: 'admin@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'password to login', example: 'adminpassword' })
  password: string;
}
