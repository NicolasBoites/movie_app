import { Catch, RpcExceptionFilter, ArgumentsHost, Logger, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements RpcExceptionFilter<RpcException> {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: RpcException | Error | any, host: ArgumentsHost): Observable<any> {
    if (exception instanceof RpcException) {
      this.logger.error(`RpcException caught: ${JSON.stringify(exception.getError())}`);
      return throwError(() => exception);
    }

    if (exception instanceof Error && exception.name === 'CastError') {
      const castError = exception as any; // Cast to 'any' to access properties like 'path'
      this.logger.warn(`Mongoose CastError caught: ${castError.message} (Path: ${castError.path})`);
      return throwError(() => new RpcException({
        statusCode: HttpStatus.BAD_REQUEST, // 400 Bad Request
        message: `Invalid ID format for '${castError.path}'. Please provide a valid 24-character hexadecimal ID.`,
        error: 'Bad Request',
      }));
    }

    if (exception instanceof Error && (exception as any).response) {
      const httpResponse = (exception as any).response;
      this.logger.error(`HTTP Exception caught: ${JSON.stringify(httpResponse)}`);
      return throwError(() => new RpcException({
        statusCode: httpResponse.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        message: httpResponse.message || 'Internal server error',
        error: httpResponse.error || 'Unknown Error',
      }));
    }
    
    this.logger.error(`Unhandled exception caught: ${exception.message || exception}`);
    return throwError(() => new RpcException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: exception.message || 'Unhandled Exception',
    }));
  }
}