import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateContactPropertyDto } from './dto/create-contact-property.dto';
@ApiTags('Contacts API')
@ApiBearerAuth('access-token')
@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  createUserContact(@Body() createContactDto: CreateContactDto) {
    return this.contactService.createUserContact(createContactDto);
  }
  @Post(':userPropertyId')
  createPropertyContact(
    @Query('userPropertyId') userPropertyId: string,
    @Body() createContactPropertyDto: CreateContactPropertyDto,
  ) {
    return this.contactService.createPropertyContact(
      createContactPropertyDto,
      +userPropertyId,
    );
  }
  @Get()
  findAll(@Req() req: Request) {
    const accId = req['user'].id;
    return this.contactService.findAllContact(+accId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contactService.findContactById(+id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactService.updateContact(+id, updateContactDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contactService.removeContact(+id);
  }
}
@Controller('userproperties')
@ApiTags('User Property  API')
@ApiBearerAuth('access-token')
export class userPropertiesController {
  constructor(private readonly contactService: ContactService) {}
  @Get(':userPropertyId/contact')
  findContactByUserProperty(@Query('userPropertyId') userPropertyId: string) {
    return this.contactService.findContactByUserPropertyId(+userPropertyId);
  }
}
