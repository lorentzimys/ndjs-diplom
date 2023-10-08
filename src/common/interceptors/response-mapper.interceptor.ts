import { instanceToPlain } from 'class-transformer';
import { Observable, map } from 'rxjs';

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

@Injectable()
export class ResponseMapperInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return instanceToPlain(data, { excludeExtraneousValues: true });
      }),
    );
  }
}
