import { AnyObject } from '@utils/base-class/base.interface';

export interface ITokenOptions {
  payload: AnyObject;
  key: string;
  audience: string;
}

export interface ITokenConfig {
  expiresIn?: number;
  issuer?: string;
  expirationType?: 'day' | 'second' | 'minute' | 'hour' | 'year';
}

export interface ICreateToken {
  expiresIn: number;
  token: string;
}
