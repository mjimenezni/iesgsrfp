import { Component } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/_services/users.service';
import { AccountService } from 'src/app/_services';
import { User } from 'src/app/_models/user';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css'],
})
export class ProfileCardComponent {
  faEdit = faEdit;
  currentUser: any;
  id: number | undefined;
  datosUser!: User;

  constructor(
    private accountService: AccountService,
    private userService: UserService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.accountService.currentUser.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });

    this.loadUserData();
  }
  loadUserData(): void {
    if (this.currentUser) {
      const userId = this.currentUser.idusuario;
      this.userService.getUserById(userId).subscribe(
        (user) => {
          // Formatear la fecha de nacimiento
          user.fecha_nac = this.datePipe.transform(
            user.fecha_nac,
            'dd/MM/yyyy'
          );
          this.datosUser = user;
        },
        (error) => {
          console.log('Error al cargar los datos del usuario', error);
        }
      );
    }
  }
}
