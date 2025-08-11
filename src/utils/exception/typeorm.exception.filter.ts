import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AnyObject } from '@utils/base-class/base.interface';
import { Request, Response } from 'express';
import { TypeORMError } from 'typeorm';
import { meta, responseBody } from '.';

@Catch(TypeORMError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: TypeORMError & { code?: string }, host: ArgumentsHost) {
    const errorMessage = exception.message;
    const request = host.switchToHttp().getRequest<Request>();
    const metaData = meta({ url: request.url, method: request.method });

    this.logger.error(
      {
        request: {
          body: request.body as AnyObject,
          headers: request.headers,
          query: request.query,
          params: request.params,
          url: request.url,
        },
        meta: metaData,
        message: errorMessage,
        errors: exception,
        // code: errorCode,
        cause: exception.cause,
      },
      exception.stack,
      'TypeORMExceptionFilter',
    );
    const response = host.switchToHttp().getResponse<Response>();

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(
      responseBody({
        // code: errorCode,
        message: 'internal server error',
        meta: metaData,
      }),
    );
  }
}
