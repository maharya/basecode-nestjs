import * as Joi from 'joi';

export default Joi.object({
  ENV: Joi.string().valid('local', 'staging', 'uat', 'production').required(),
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().required(),
  APP_URL: Joi.string().required(),
});
