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
            console.error(`[ProxyService] Error caught from ${serviceName}:`, error);

            if (error instanceof TimeoutError) {
              throw new HttpException(
                `Service unavailable: ${serviceName} did not respond in time`,
                HttpStatus.GATEWAY_TIMEOUT
              );
            }

            let finalErrorData: { statusCode: number, message: string | string[], error: string } = {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Unexpected microservice error',
                error: 'MicroserviceError'
            };

            const rawErrorContent = (error instanceof RpcException) ? error.getError() : error;

            if (typeof rawErrorContent === 'object' && rawErrorContent !== null && 'error' in rawErrorContent && typeof rawErrorContent.error === 'object') {
                const nestedError = rawErrorContent.error;
                if (this.isMicroserviceErrorResponse(nestedError)) {
                  finalErrorData.statusCode = nestedError.statusCode;
                  finalErrorData.message = nestedError.message;
                  finalErrorData.error = nestedError.error;
                } else {
                  console.error(`[ProxyService] Nested error from ${serviceName} with unexpected format:`, nestedError);
                  finalErrorData.message = `Nested microservice error with unexpected format: ${JSON.stringify(nestedError)}`;
                }
            } else if (this.isMicroserviceErrorResponse(rawErrorContent)) {
                finalErrorData.statusCode = rawErrorContent.statusCode;
                finalErrorData.message = rawErrorContent.message;
                finalErrorData.error = rawErrorContent.error;
            } else {
                console.error(`[ProxyService] Completely unexpected error format from ${serviceName}:`, rawErrorContent);
                finalErrorData.message = `Microservice error with unexpected format: ${JSON.stringify(rawErrorContent)}`;
                finalErrorData.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            }

            throw new HttpException(
              {
                statusCode: finalErrorData.statusCode,
                message: finalErrorData.message,
                error: finalErrorData.error,
              },
              finalErrorData.statusCode
            );
          })
        )
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // Propagate HttpException so the global filter can catch it
      }
      console.error(`[ProxyService] Critical error sending message to ${serviceName} (outside pipe):`, error);
      throw new HttpException(`Critical communication failure with ${serviceName}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Validator for the microservice error structure
  private isMicroserviceErrorResponse(error: any): error is MicroserviceErrorResponse {
    return (
      typeof error === 'object' &&
      error !== null &&
      typeof error.statusCode === 'number' &&
      (typeof error.message === 'string' || Array.isArray(error.message)) &&
      typeof error.error === 'string'
    );
  }
}