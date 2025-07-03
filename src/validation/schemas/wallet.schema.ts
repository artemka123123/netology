import * as Joi from "joi";

export const WalletSchema = Joi.object().keys({

    name: Joi.string().min(3).required(),
    type: Joi.string().allow("business", "individual").required()

});