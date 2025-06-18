import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseConnectionException extends HttpException {
  constructor(message: string = 'Database connection error.') {
    super(message, HttpStatus.SERVICE_UNAVAILABLE); // 503 Service Unavailable
  }
}