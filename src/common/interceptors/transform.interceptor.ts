import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// import { UsersService } from 'src/modules/users/users.service';
interface IResponse<T> {
  isSuccess: boolean;
  code: number;
  page: number;
  totalPage: number;
  previousPage: string;
  nextPage: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, IResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<IResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => ({
        isSuccess: true,
        code: response.statusCode,
        page: data?.page,
        total: data?.total,
        totalPage: data?.totalPage,
        previousPage: data?.previousPage,
        nextPage: data?.nextPage,
        data: data?.data ? data.data : data,
        message: request.message,
      })),
    );
  }
}
