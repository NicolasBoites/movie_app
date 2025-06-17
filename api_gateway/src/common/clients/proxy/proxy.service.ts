import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
          catchError(error => {
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