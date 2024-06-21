import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';
import { Roles } from 'src/common/enum/Roles.enum';
@ApiTags('Properties API')
@ApiBearerAuth('access-token')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @RolesDecorator(Roles.OWNER)
  @Post()
  create(@Req() req: Request, @Body() createPropertyDto: CreatePropertyDto) {
    const accId = req['user'].id;
    const companyId = req.headers['CompanyId'];
    return this.propertiesService.createProperty(
      +accId,
      +companyId,
      createPropertyDto,
    );
  }

  @Get()
  @RolesDecorator(Roles.OWNER)
  findAll(@Req() req: Request) {
    const accId = req['user'].id;
    return this.propertiesService.findPropertyByAccId(accId);
  }

  @RolesDecorator(Roles.ADMIN, Roles.OWNER)
  @Get(':propertyId/unit')
  findUnit(@Param('propertyId') propertyId: string) {
    return this.propertiesService.findUnitByPropertyId(+propertyId);
  }

  @RolesDecorator(Roles.ADMIN, Roles.OWNER)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(+id, updatePropertyDto);
  }

  @RolesDecorator(Roles.ADMIN, Roles.OWNER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertiesService.removeProperty(+id);
  }
}
