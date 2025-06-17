import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform<any> {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'param' && typeof value === 'string') {
      if (!Types.ObjectId.isValid(value)) {
        throw new BadRequestException(`Validation failed: Invalid ID format. A 24-character hexadecimal string was expected.`);
      }
    }
    return value;
  }
}