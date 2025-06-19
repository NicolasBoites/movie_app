import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let errorName: string = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (exception instanceof BadRequestException && typeof exceptionResponse === 'object' && exceptionResponse !== null && Array.isArray((exceptionResponse as any).message)) {
        message = (exceptionResponse as any).message;
        errorName = (exceptionResponse as any).error || HttpStatus[status].toString();
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        errorName = HttpStatus[status].toString();
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || message;
        errorName = (exceptionResponse as any).error || errorName;
      }
      this.logger.error(`[HTTP Exception] ${status} - ${JSON.stringify(message)}`);

    } else if (exception instanceof RpcException) {
      const rpcError = exception.getError();
      this.logger.error(`[RPC Exception] RpcException received directly by filter: ${JSON.stringify(rpcError)}`);

      if (typeof rpcError === 'object' && rpcError !== null && 'statusCode' in rpcError && typeof rpcError.statusCode === 'number') {
        status = rpcError.statusCode;
        message = (rpcError as any).message || 'Microservice error';
        errorName = (rpcError as any).error || 'MicroserviceError';
        this.logger.warn(`[RPC Exception] Converting to HTTP ${status}: ${JSON.stringify(message)}`);
      } else {
        message = `Unexpected microservice error format: ${JSON.stringify(rpcError)}`;
        this.logger.error(`[RPC Exception] Unexpected RPC error format: ${JSON.stringify(rpcError)}`);
      }
    } else {
      this.logger.error(`[Unknown Exception] ${exception instanceof Error ? exception.message : JSON.stringify(exception)}`, exception instanceof Error ? exception.stack : undefined);
      message = exception instanceof Error ? exception.message : 'An unexpected error occurred.';
      errorName = exception instanceof Error ? exception.name : 'UnknownError';
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      error: errorName,
    });
  }
}