import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";


@Injectable()
export class IntegerValidationPipe implements PipeTransform {

    constructor(
        private min: number = -1,
        private max: number = -1,
        private defaultInt: number = null
    ) {}

    transform(value: any, metadata: ArgumentMetadata) {
        let valueInt: number = null;

        if (typeof(value) == "number") {

            if (Number.isInteger(valueInt))
                valueInt = value;
        }

        if (typeof(value) == "string")
            valueInt = parseInt(value)
    
        if (valueInt == null) {
            if (this.defaultInt != null) return this.defaultInt;
            
            throw new HttpException(`${metadata.data} must be integer.`, HttpStatus.BAD_REQUEST)
        }

        if (this.min == this.max) return valueInt;
        if (valueInt < this.min) throw new HttpException(`${metadata.data} must be greater than ${this.min - 1}`, HttpStatus.BAD_REQUEST)
        if (valueInt > this.max) throw new HttpException(`${metadata.data} must be less than ${this.max}`, HttpStatus.BAD_REQUEST)

        return valueInt;
    }
}