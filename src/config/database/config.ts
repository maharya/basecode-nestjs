import { registerAs } from '@nestjs/config';
import * as process from 'node:process';
import { DatabaseType, DataSourceOptions } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default registerAs('database', () => ({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  readHost: process.env.DB_READ_HOST ?? process.env.DB_HOST,
  readPort: process.env.DB_READ_PORT ?? process.env.DB_PORT,
  readUsername: process.env.DB_READ_USERNAME ?? process.env.DB_USERNAME,
  readPassword: process.env.DB_READ_PASSWORD ?? process.env.DB_PASSWORD,
  readName: process.env.DB_READ_NAME ?? process.env.DB_NAME,
}));

export type DBConfig = {
  type: DatabaseType;
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  readHost: string;
  readPort: number;
  readUsername: string;
  readPassword: string;
  readName: string;
};
function postgresConfigMapping(dbConfig: DBConfig): PostgresConnectionOptions {
  return {
    type: 'postgres',
    replication: {
      master: {
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.name,
        username: dbConfig.username,
        password: dbConfig.password,
      },
      slaves: [
        {
          host: dbConfig.readHost,
          port: dbConfig.readPort,
          database: dbConfig.readName,
          username: dbConfig.readUsername,
          password: dbConfig.readPassword,
        },
      ],
    },
    logging: true,
    synchronize: false,
    entities: ['./src/modules/**/models/*.ts'],
    migrations: ['./src/modules/**/migrations/*.ts'],
  };
}
function mysqlConfigMapping(dbConfig: DBConfig): MysqlConnectionOptions {
  return {
    type: 'mysql',
    replication: {
      master: {
        host: dbConfig.host,
        port: dbConfig.port,
        database: dbConfig.name,
        username: dbConfig.username,
        password: dbConfig.password,
      },
      slaves: [
        {
          host: dbConfig.readHost,
          port: dbConfig.readPort,
          database: dbConfig.readName,
          username: dbConfig.readUsername,
          password: dbConfig.readPassword,
        },
      ],
    },
    logging: true,
    synchronize: false,
    entities: ['./src/modules/**/models/*.ts'],
    migrations: ['./src/modules/**/migrations/*.ts'],
  };
}

export function configMapping(dbConfig: DBConfig): DataSourceOptions {
  let config = {} as DataSourceOptions;
  switch (dbConfig.type) {
    case 'postgres':
      config = postgresConfigMapping(dbConfig);
      break;
    case 'mysql':
      config = mysqlConfigMapping(dbConfig);
      break;
    default:
      config = postgresConfigMapping(dbConfig);
      break;
  }

  return config;
}
