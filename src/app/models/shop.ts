import { Entity } from './entity';

export interface Shop extends Entity  {
  name: string;
  description: string;
  location: string;
  currencyCode:string;
}