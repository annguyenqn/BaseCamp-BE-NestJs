import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';
import { InvitationStatus } from '../../../common/enum/InvitationStatus.enum';
import { Roles } from '../../../common/enum/Roles.enum';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Account id to define what is company user belong to',
    example: 1,
  })
  accountId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'To define is user active:1, deactive:0, param is just 0 or 1',
    example: 0,
  })
  isActive: number;

  @IsEnum(InvitationStatus)
  @ApiProperty({
    enum: InvitationStatus,
    enumName: 'Invitation Status',
    description:
      'InvitationStatus of user Set user status according to enum InvitationStatus standards ',
    example: 'PENDING',
  })
  invitationStatus: InvitationStatus;

  @IsEnum(Roles)
  @ApiProperty({
    enum: Roles,
    enumName: 'User Roles',
    description:
      'Role of user Set user permissions according to enum Roles standards ',
    example: 'ADMIN ',
  })
  roles: Roles;
}
