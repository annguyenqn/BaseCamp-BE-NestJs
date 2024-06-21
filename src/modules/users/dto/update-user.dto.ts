import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { InvitationStatus } from '../../../common/enum/InvitationStatus.enum';
import { Roles } from 'src/common/enum/Roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Account id to define what is company user belong to',
    example: 1,
  })
  accountId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Company id to define what is company user belong to',
    example: 1,
  })
  companyId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'To define is user active:1, deactive:0, param is just 0 or 1',
    example: 0,
  })
  isActive: number;

  @IsOptional()
  @IsEnum(Roles)
  @ApiProperty({
    enum: Roles,
    enumName: 'User Roles',
    description:
      'Role of user Set user permissions according to enum Roles standards ',
    example: 'Admin',
  })
  roles: Roles;

  @IsOptional()
  @IsEnum(InvitationStatus)
  @ApiProperty({
    enum: InvitationStatus,
    enumName: 'Invitation Status',
    description:
      'InvitationStatus of user Set user status according to enum InvitationStatus standards ',
    example: 'Pending',
  })
  invitationStatus: InvitationStatus;
}
