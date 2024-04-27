import { CallHandler, ExecutionContext, Injectable, NestInterceptor, NotFoundException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EntityNotFoundError } from '../errors/entity-not-found.error';
import { ErrorMessageModel } from '../result/error-message.model';

@Injectable()
export class EntityNotFoundInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                if (error instanceof EntityNotFoundError) {
                    throw new NotFoundException(new ErrorMessageModel(error.message));
                } else {
                    throw error;
                }
            }),
        );
    }
}
