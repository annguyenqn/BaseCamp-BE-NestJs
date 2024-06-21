import { Controller, Get, Body, Patch, Req } from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/common/enum/Roles.enum';
import { RolesDecorator } from 'src/common/decorators/roles.decorator';
@ApiTags('Companies API')
@ApiBearerAuth('access-token')
@Controller('companies')
export class CompanyController {
  constructor(private companyService: CompanyService) { }
  @Get()
  getCompanyInfo(@Req() req: Request) {
    const companyId = req.headers['CompanyId'];
    return this.companyService.findCompanyById(+companyId);
  }

  @RolesDecorator(Roles.COMPANY_OWNER)
  @Patch()
  async update(
    @Req() req: Request,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const companyId = req.headers['CompanyId'];
    return this.companyService.updateCompany(+companyId, updateCompanyDto);
  }
}
