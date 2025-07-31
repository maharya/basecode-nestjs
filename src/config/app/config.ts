import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('app', () => ({
  env: process.env.ENV,
  port: process.env.PORT,
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
}));
