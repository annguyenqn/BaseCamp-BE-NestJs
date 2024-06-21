import { PartialType } from '@nestjs/mapped-types';
import { CreatePropertyDto } from './create-property.dto';
import { IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyStatus } from 'src/common/enum/PropertyStatus';
import { TypeProperty } from 'src/common/enum/TypeProperty.enum';
export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'Id Parent', example: 1 })
  parentId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Street line of this property',
    example: 'nguyen thi dinh',
  })
  streetLine: string;

  @IsEnum(PropertyStatus)
  @IsOptional()
  @ApiProperty({ description: 'Status of this property', example: 'AVAIBLE' })
  status: PropertyStatus;

  @IsEnum(TypeProperty)
  @IsOptional()
  @ApiProperty({ description: 'type of this property', example: 'BUILDING' })
  type: TypeProperty;
}
