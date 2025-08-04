import * as Joi from "joi";
import { EmailRegExp, PhoneRegExp } from "src/validation/regexp.validation.pipe";

export const SignUpValidationSchema = Joi.object().keys({

    email: Joi.string().regex(EmailRegExp).required(),
    contactPhone: Joi.string().regex(PhoneRegExp),

    name: Joi.string().min(3).max(16).required(),
    
    password: Joi.string().required()

});