import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";


@Injectable()
export class AppUserValidationPipe implements PipeTransform {

    private regex: RegExp = new RegExp("[.,&\\[\\]\\{\\}<>?/'\"@#!]+");

    transform(value: any, metadata: ArgumentMetadata) {
        
        if (typeof(value) != "string") throw new Error("Username isn't correct")
        if (this.regex.test(value)) throw new Error("Username isn't correct")

        return value;
    }
}