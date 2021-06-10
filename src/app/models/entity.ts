import { Auditable } from './auditable';

export interface Entity extends Auditable{
  id: string;
}