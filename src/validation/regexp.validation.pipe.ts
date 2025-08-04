import { ArgumentMetadata, HttpException, Injectable, PipeTransform } from "@nestjs/common";

export const EmailRegExp = RegExp("^\\w+@\\w+\.\\w+");
export const PhoneRegExp = RegExp("[0-9]{11}")

@Injectable()
export class RegExpValidationPipe implements PipeTransform {

    constructor(private regExp: RegExp) {}

    transform(value: any, metadata: ArgumentMetadata) {
        
        if (typeof(value) != "string") return undefined;

        if (!this.regExp.test(value)) 
            throw new HttpException(`${metadata.data} is invalid.`, 400)

        return value
    }
}