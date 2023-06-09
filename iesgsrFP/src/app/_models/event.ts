import { Group } from './group';

export class Event {
  idevento?: number;
  idgrupo?: number;
  evento?: string;
  fecha?: Date | string | null;
  grupo?: Group; // Campo opcional para almacenar el grupo completo
}
