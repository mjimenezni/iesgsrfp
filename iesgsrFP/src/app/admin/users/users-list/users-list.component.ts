import { Component } from '@angular/core';
import { UserService } from 'src/app/_services/users.service';
import { User } from 'src/app/_models';
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
  usuarios: User[] | undefined;
  nuevoUsuario: User = new User();
  deleteConfirmation = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getAllUsers().subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
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
