// movies-backend/src/common/filters/rpc-exception.filter.ts
import { Catch, RpcExceptionFilter, ArgumentsHost, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { HttpException } from '@nestjs/common';

@Catch(RpcException, HttpException)
export class AllExceptionsFilter implements RpcExceptionFilter<RpcException | HttpException> {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: RpcException | HttpException, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToRpc().getContext();
    let errorResponse: any;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      errorResponse = {
        statusCode: status,
        message: (response as any).message || response,
        error: (response as any).error || exception.name,
      };
      this.logger.error(`[RpcExceptionFilter] Caught HttpException: ${JSON.stringify(errorResponse)}`);

    } else if (exception instanceof RpcException) {
      const rpcError = exception.getError();
      if (typeof rpcError === 'object' && rpcError !== null && 'statusCode' in rpcError && 'message' in rpcError) {
        errorResponse = rpcError;
        this.logger.error(`[RpcExceptionFilter] Caught RpcException (valid format): ${JSON.stringify(errorResponse)}`);
      } else {
        errorResponse = {
          statusCode: 500,
          message: 'Unknown microservice error or unexpected RPC error format.',
          originalError: rpcError
        };
        this.logger.error(`[RpcExceptionFilter] Caught RpcException (INVALID format): ${JSON.stringify(errorResponse)}`);
      }
    } else {
      const errorMessage = (exception as any)?.message || String(exception);
      errorResponse = {
        statusCode: 500,
        message: 'Internal server error',
        originalError: errorMessage
      };
      this.logger.error(`[RpcExceptionFilter] Caught unknown exception: ${JSON.stringify(errorResponse)}`);
    }

    return throwError(() => new RpcException(errorResponse));
  }
}