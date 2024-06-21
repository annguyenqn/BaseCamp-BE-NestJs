import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  I18nContext,
  I18nValidationException,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';
import { AppHelper } from '../helpers/app.helper';
// import { formatI18nErrors } from '../helpers/format-i18n-errors.helpers';

@Catch()
export class HttpExceptionFilter extends I18nValidationExceptionFilter {
  catch(exception: I18nValidationException, host: ArgumentsHost) {
    const i18n = I18nContext.current();
    const lang = i18n?.lang || 'en';
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { message, stack } = exception;
    Logger.error(JSON.stringify({ message, stack }));
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    // let errors = AppHelper.constantExceptionErrors(
    //   message,
    //   i18n?.service,
    //   lang,
    // );
    let errors = AppHelper.constantExceptionErrors(
      message,
      i18n?.service,
      lang,
    );
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      // errors = Array.isArray(exception.errors)
      //   // ? formatI18nErrors(exception.errors, i18n?.service, lang)
      //   // : exception?.getResponse()
      //   ? [exception?.getResponse()]
      //   : errors;
    }
    return response.status(status).json({
      isSuccess: false,
      code: status,
      // message: AppHelper.formatExcetionErrorsToMessage(errors),
      // message: (errors),
      errors,
    });
  }
}
