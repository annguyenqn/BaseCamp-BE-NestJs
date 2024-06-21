import {
  Body,
  Controller,
  Post,
  Req,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';
import { Public } from '../../common/decorators/public.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth API')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @Post(':refreshToken')
  async refreshTokens(
    @Req() req: Request,
    @Query('token') refreshToken: string,
  ) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    try {
      const tokens = await this.authService.refreshTokens(
        accessToken,
        refreshToken,
      );
      return tokens;
    } catch (error) {
      return { message: 'Failed to refresh token', error: error };
    }
  }
}
