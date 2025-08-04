import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";
import mongoose from "mongoose";

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {

    transform(value: any, metadata: ArgumentMetadata) {
        
        if (typeof(value) != "string") return undefined;

        if (!mongoose.isValidObjectId(value))
            throw new HttpException("Invalid id.", HttpStatus.BAD_REQUEST)

        return value
    }
}