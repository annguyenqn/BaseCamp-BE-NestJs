import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyStatus } from 'src/common/enum/PropertyStatus';
import { TypeProperty } from 'src/common/enum/TypeProperty.enum';
export class CreatePropertyDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Id user', example: 1 })
  userId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Id Parent', example: 1 })
  parentId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Street line of this property',
    example: 'nguyen thi dinh',
  })
  streetLine: string;

  @IsEnum(PropertyStatus)
  @IsNotEmpty()
  @ApiProperty({ description: 'Status of this property', example: 'AVAIBLE' })
  status: PropertyStatus;

  @IsEnum(TypeProperty)
  @IsNotEmpty()
  @ApiProperty({ description: 'type of this property', example: 'BUILDING' })
  type: TypeProperty;
}
