import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { MicroserviceErrorResponse } from '../../interfaces/microservice-error.interface';

@Injectable()
export class ProxyService {
  constructor(
    @Inject('AUTH_USER_SERVICE') private readonly authUserServiceClient: ClientProxy,
    @Inject('MOVIES_SERVICE') private readonly moviesServiceClient: ClientProxy,
  ) {}

  async sendMicroserviceMessage(
    pattern: string | Record<string, any>,
    data: any,
    user?: any,
    serviceName: 'AUTH_USER_SERVICE' | 'MOVIES_SERVICE' = 'AUTH_USER_SERVICE'
  ): Promise<any> {
    try {
      const payload = user ? { ...data, userId: user.sub, userEmail: user.username } : data;

      let client: ClientProxy;
      if (serviceName === 'MOVIES_SERVICE') {
        client = this.moviesServiceClient;
      } else {
        client = this.authUserServiceClient;
      }

      return await firstValueFrom(
        client.send(pattern, payload).pipe(
          timeout(10000),
          catchError(error => {

            if (error instanceof TimeoutError) {
              console.error(`Microservice ${serviceName} timed out after 5s:`, error.message);
              throw new HttpException(
                `Service unavailable: ${serviceName} did not respond in time`,
                HttpStatus.GATEWAY_TIMEOUT // 504 Gateway Timeout
              );
            }
            if (error instanceof RpcException) {
              const rpcError = error.getError();

              if (this.isMicroserviceErrorResponse(rpcError)) {
                console.error(`Received RpcException from ${serviceName}:`, rpcError);
                throw new HttpException(rpcError.message, rpcError.statusCode || HttpStatus.INTERNAL_SERVER_ERROR);
              } else {
                console.error(`Received RpcException from ${serviceName} with unexpected format:`, rpcError);
                throw new HttpException('Unhandled microservice error: Unknown format', HttpStatus.INTERNAL_SERVER_ERROR);
              }
            }

            const nodeError = error as NodeJS.ErrnoException;
            if (nodeError.code === 'ECONNRESET') {
              console.error(`Connection to ${serviceName} was reset (ECONNRESET). Microservice might have crashed or restarted:`, nodeError.message);
              throw new HttpException(
                `Service unavailable: ${serviceName} connection reset`,
                HttpStatus.SERVICE_UNAVAILABLE // 503 Service Unavailable
              );
            } else if (nodeError.code === 'ECONNREFUSED' || nodeError.code === 'EADDRNOTAVAIL') {
              console.error(`Could not connect to ${serviceName} (ECONNREFUSED/EADDRNOTAVAIL). Microservice might not be running or config is wrong:`, nodeError.message);
              throw new HttpException(
                `Service unavailable: Could not connect to ${serviceName}`,
                HttpStatus.SERVICE_UNAVAILABLE
              );
            }

            console.error(`Unexpected error from microservice ${serviceName}:`, error);
            throw new HttpException(`Failed to communicate with ${serviceName}`, HttpStatus.INTERNAL_SERVER_ERROR);
          })
        )
      );
    } catch (error) {
      console.error(`Error sending message to microservice ${serviceName}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error during microservice communication', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private isMicroserviceErrorResponse(error: unknown): error is MicroserviceErrorResponse {
    return (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      typeof (error as any).statusCode === 'number' &&
      'message' in error &&
      (typeof (error as any).message === 'string' || Array.isArray((error as any).message))
    );
  }
}