import { IsString, IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/common/enum/Roles.enum';
export class mailDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email Property Manager to invite',
    example: 'nanorealfibo@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'First Name Property Manager to invite', example: 'Jame' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Last Name Property Manager to invite', example: 'Gun' })
  lastName: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'CompanyId who invite Property Manager', example: 1 })
  companyId: number;

  @IsEnum(Roles)
  @IsNotEmpty()
  @ApiProperty({ enum: Roles, description: 'Role property manager', example: 'PROPERTY_MANAGER' })
  role: string;
}
