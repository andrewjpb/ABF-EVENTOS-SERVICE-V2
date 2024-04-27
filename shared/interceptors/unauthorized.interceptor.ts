import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UnauthorizedRrror } from '../errors/unauthorized.rrror';

@Injectable()
export class UnauthorizedInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                if (error instanceof UnauthorizedRrror) {
                    throw new UnauthorizedException(new Error('unauthorized'));
                } else {
                    throw error;
                }
            }),
        );
    }
}
