import Joi from "joi";

const registerSchema = Joi.object()
  .keys({
    firstName: Joi.string()
      .regex(/^[a-zA-Z]*$/)
      .min(3)
      .max(30)
      .required()
      .messages({ "string.base": "Name must be in alphabet" }),

    lastName: Joi.string()
      .regex(/^[a-zA-Z]*$/)
      .min(2)
      .max(30)
      .required()
      .messages({ "string.base": "Last name must be in alphabet" }),

    email: Joi.string()
      .regex(
        /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
      )
      .required(),

    password: Joi.string()
      .required()
      .min(8)
      .max(20)
      .pattern(
        new RegExp(
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$"
        )
      )
      .messages({
        "string.pattern.base":
          "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character",
      }),

    phoneNumber: Joi.string()
      .length(10)
      .regex(/^(?:\(?\+977\)?)?[9][6-9]\d{8}|01[-]?[0-9]{7,}$/)
      .message("Enter a valid phonenumber")
      .required(),
  })
  .unknown(false);

export default registerSchema;
