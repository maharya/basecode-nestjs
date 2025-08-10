import * as Joi from 'joi';

export default Joi.object({
  DB_TYPE: Joi.string().default('postgres'),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number(),
  DB_USERNAME: Joi.string(),
  DB_PASSWORD: Joi.string().optional(),
  DB_NAME: Joi.string(),
});
