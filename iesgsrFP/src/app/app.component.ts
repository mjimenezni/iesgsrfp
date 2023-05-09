import { Component } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from './_services';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'iesgsrFP';
  faBars = faBars;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  constructor(public accountService: AccountService) {}

  ngOnInit(): void {
    // Comprobar si hay un token guardado en localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Si hay un token, establecer el estado de inicio de sesión como verdadero
      this.isLoggedIn = true;
      // Configurar el token en el servicio de cuenta
      this.accountService.setToken(token);
    }
    // Suscribirse al Subject del AuthService para actualizar el estado de inicio de sesión
    this.accountService.isLoggedIn.subscribe((value) => {
      this.isLoggedIn = value;
    });
    this.accountService.isAdminUser.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }
  onLogout() {
    this.accountService.logout();
  }
}