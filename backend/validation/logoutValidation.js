import Joi from "joi";

const logoutSchema = Joi.object()
  .keys({
    token: Joi.string(),
  })
  .unknown(false);

export default logoutSchema;
