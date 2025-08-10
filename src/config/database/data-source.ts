import * as dotenv from 'dotenv';
import * as fs from 'node:fs';
import { DatabaseType, DataSource } from 'typeorm';
import { configMapping } from './config';

const env = dotenv.parse(fs.readFileSync('.env'));
export default new DataSource(
  configMapping({
    type: env.DB_TYPE as DatabaseType,
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    name: env.DB_NAME,
    readHost: env.DB_READ_HOST ?? env.DB_HOST,
    readPort: Number(env.DB_READ_PORT ?? env.DB_PORT),
    readUsername: env.DB_READ_USERNAME ?? env.DB_USERNAME,
    readPassword: env.DB_READ_PASSWORD ?? env.DB_PASSWORD,
    readName: env.DB_READ_NAME ?? env.DB_NAME,
  }),
);
