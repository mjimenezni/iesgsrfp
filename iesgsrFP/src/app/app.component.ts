import { Component } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { AccountService } from './_services';
import { Renderer2 } from '@angular/core';
import 'src/assets/js/bundle.min.js';
import { ViewChild } from '@angular/core';
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
  currentUser: any;

  isMenuOpen = false;

  constructor(
    public accountService: AccountService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    //Lógica que permita que el menú hamburguesa se cirre al pulsar fuera
    this.renderer.listen('document', 'click', (event: any) => {
      const target = event.target;

      if (
        !target.closest('.navbar-collapse') &&
        !target.closest('.navbar-toggler')
      ) {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          navbarCollapse.classList.remove('show');
        }
      }
    });
    // Comprobar si hay un token guardado en localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Si hay un token, establecer el estado de inicio de sesión como verdadero
      this.isLoggedIn = true;
      // Configurar el token en el servicio de cuenta
      this.accountService.setToken(token);
      this.accountService.currentUser.subscribe((currentUser) => {
        this.currentUser = currentUser;
      });
    }
    // Suscribirse al Subject del AuthService para actualizar el estado de inicio de sesión
    this.accountService.isLoggedIn.subscribe((value) => {
      this.isLoggedIn = value;
      if (value) {
        // Obtener el usuario actual si está autenticado
        this.accountService.currentUser.subscribe((currentUser) => {
          this.currentUser = currentUser;
        });
      }
    });
    this.accountService.isAdminUser.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }
  onLogout() {
    this.accountService.logout();
  }

  //Función para que se vuelva a plegar el menú hamburguesa al seleccionar un elemento
  closeMenu(): void {
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  }
}
