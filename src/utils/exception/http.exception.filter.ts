import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AnyObject } from '@utils/base-class/base.interface';
import { VALIDATION_CODE } from '@utils/error';
import { Request, Response } from 'express';
import { meta, responseBody } from '.';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const errorResponse: any = exception.getResponse();

    const errorCode = errorResponse?.code || errorResponse?.error || undefined;

    const status = exception.getStatus();

    const isValidationException =
      errorCode === VALIDATION_CODE &&
      status === HttpStatus.UNPROCESSABLE_ENTITY;

    const errorMessage = isValidationException
      ? errorResponse?.message.map((error) => ({
          source: error.field
            ? {
                pointer: error.field,
              }
            : undefined,
          detail: error.message,
        }))
      : exception.message;

    const request = host.switchToHttp().getRequest<Request>();
    const metaData = meta({ url: request.url, method: request.method });
    this.logger.log(
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
        errors: errorResponse?.message,
        cause: exception.cause,
        code: errorCode,
      },
      exception.stack,
      'HttpException',
    );

    return host
      .switchToHttp()
      .getResponse<Response>()
      .status(exception.getStatus())
      .send(
        responseBody({
          code: errorCode,
          message: errorMessage,
          meta: metaData,
        }),
      );
  }
}
