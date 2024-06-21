import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class signUpDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email Property Manager to invite',
    example: 'nanorealfibo@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: 'Password of user', example: '123456789' })
  password: string;

  @IsString()
  @ApiProperty({ description: 'Name of user', example: 'John' })
  firstName: string;

  @IsString()
  @ApiProperty({ description: 'Last Name of user', example: 'Witch' })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email Property Manager to invite', example: '123456' })
  enteredOtp: string;
}
