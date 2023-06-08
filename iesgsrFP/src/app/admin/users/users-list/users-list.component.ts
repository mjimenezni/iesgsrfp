import { Component } from '@angular/core';
import { UserService } from 'src/app/_services/users.service';
import { User } from 'src/app/_models/user';
import { Group } from 'src/app/_models/group';
import { Router } from '@angular/router';
import {
  faTrash,
  faPencil,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
})
export class UsersListComponent {
  faTrash = faTrash;
  faPencil = faPencil;
  faUserPlus = faUserPlus;
  usuarios!: User[];
  nuevoUsuario: User = new User();
  deleteConfirmation = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getAllUsers().subscribe((usuarios) => {
      this.usuarios = usuarios;
      this.loadGroups();
    });
  }
  loadGroups() {
    if (this.usuarios) {
      // Iterar sobre cada usuario y obtener el grupo completo
      // Obtener el grupo para cada usuario
      this.usuarios.forEach((usuario) => {
        if (usuario.idgrupo) {
          this.userService.getGroupById(usuario.idgrupo).subscribe((grupo) => {
            usuario.grupo = grupo;
          });
        }
      });
    }
  }

  createUser() {
    this.userService.createUser(this.nuevoUsuario).subscribe(
      () => {
        this.nuevoUsuario = new User(); // limpiar los valores del formulario
        this.getUsers(); // obtener los usuarios actualizadas después de la creación
      },
      (error) => console.error(error)
    );
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(
      () => {
        this.getUsers();
      },
      (error) => {
        console.error(error);
        // Manejar el error en caso de que la eliminación del usuario falle
      }
    );
  }

  confirmDelete(id: number) {
    const confirmation = window.confirm(
      '¿Estás seguro de eliminar el usuario?'
    );
    if (confirmation) {
      this.deleteUser(id);
      this.deleteConfirmation = false;
    }
  }

  editUser(id: number) {
    this.router.navigate(['/admin/users', id, 'edit']);
  }
}
