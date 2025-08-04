import * as Joi from "joi";
import { EmailRegExp, PhoneRegExp } from "src/validation/regexp.validation.pipe";

export const LoginValidationSchema = Joi.object().keys({

    email: Joi.string().regex(EmailRegExp).required(),
    
    password: Joi.string().required()

});