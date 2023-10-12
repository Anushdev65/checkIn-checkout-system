import Joi from "joi";

const timeTrackingSchema = Joi.object().keys({
  id: Joi.string().required(),
  title: Joi.string().optional(),
  plannedWorkingHours: Joi.number().optional(),
});

export default timeTrackingSchema;