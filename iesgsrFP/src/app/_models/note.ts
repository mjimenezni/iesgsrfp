import { Group } from './group';

export class Note {
  idnota?: number;
  titulo?: string;
  contenido?: string;
  fecha?: Date | null | string;
  grupos?: Group[]; // Campo opcional para almacenar los grupos completos
}
