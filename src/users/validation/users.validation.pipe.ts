import { ArgumentMetadata, HttpException, Injectable, PipeTransform } from "@nestjs/common";
import { ObjectSchema } from 'joi';

@Injectable()
export class SchemaValidationPipe implements PipeTransform {
    constructor(private schema: ObjectSchema) {}

    transform(value: any, metadata: ArgumentMetadata) {
        const { error } = this.schema.validate(value);

        if (error)
            throw new HttpException(error.message, 400);

        return value;
    }
}