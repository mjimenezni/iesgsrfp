import { Group } from './group';

export class User {
  idusuario?: number;
  email?: string;
  password?: string;
  nombre?: string;
  isAdmin?: boolean;
  idgrupo?: number;
  ape1?: string;
  ape2?: string;
  fecha_nac?: Date;
  telefono?: string;
  direccion?: string;
  email2?: string;
  avatar?: string;
  grupo?: Group; // Campo opcional para almacenar el grupo completo
}
