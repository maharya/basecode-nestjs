import {
  flatten,
  Injectable,
  PipeTransform,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { AnyObject } from '@utils/base-class/base.interface';
import { VALIDATION_CODE } from '../error';

@Injectable()
export class CustomValidationPipe
  extends ValidationPipe
  implements PipeTransform<any>
{
  createExceptionFactory(): (validationErrors?: ValidationError[]) => unknown {
    return (validationErrors = []) => {
      const mappedErrors = validationErrors?.map((error) => {
        if (error?.children?.length === 0 && error?.constraints) {
          return this.transformError(error);
        }

        if (error?.children?.[0]) {
          return this.getChildrenConstraint(error.children[0], error.property);
        }

        return null;
      });

      return new UnprocessableEntityException(
        flatten(mappedErrors),
        VALIDATION_CODE,
      );
    };
  }

  private getChildrenConstraint(
    children: ValidationError,
    parent?: string,
  ): AnyObject | null {
    if (children.constraints) return this.transformError(children, parent);

    if (children?.children?.[0]) {
      return this.getChildrenConstraint(
        children.children[0],
        `${parent}.${children.property}`,
      );
    }

    return null;
  }

  private transformError(error: ValidationError, parent?: string) {
    const messages = Object.values(error.constraints as AnyObject);
    const field = parent ? `${parent}.${error.property}` : error.property;

    return messages.map((message: string) => {
      return { field, message };
    });
  }
}
