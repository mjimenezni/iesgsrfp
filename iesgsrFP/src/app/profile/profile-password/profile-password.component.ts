import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/_services';
import { UserService } from 'src/app/_services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-password',
  templateUrl: './profile-password.component.html',
  styleUrls: ['./profile-password.component.css'],
})
export class ProfilePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  passwordsDoNotMatch: boolean = false;
  currentUser: any;
  datosUser: any;
  submitted = false;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private userService: UserService,
    private router: Router
  ) {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.accountService.currentUser.subscribe((currentUser) => {
      this.currentUser = currentUser;
      this.loadUserData();
    });
  }
  loadUserData(): void {
    if (this.currentUser) {
      const userId = this.currentUser.idusuario;
      this.userService.getUserById(userId).subscribe(
        (user) => {
          this.datosUser = user;
          // Asignar el email del usuario al currentUser
          this.currentUser.email = this.datosUser.email;
        },
        (error) => {
          console.log('Error al cargar los datos del usuario', error);
        }
      );
    }
  }
  get f() {
    return this.changePasswordForm.controls;
  }
  onSubmit(): void {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    const currentPassword =
      this.changePasswordForm.get('currentPassword')?.value;
    const newPassword = this.changePasswordForm.get('newPassword')?.value;
    const confirmPassword =
      this.changePasswordForm.get('confirmPassword')?.value;

    // Realiza la lógica para cambiar la contraseña
    if (newPassword !== confirmPassword) {
      this.passwordsDoNotMatch = true;
      return;
    }

    // Llamar al servicio para cambiar la contraseña
    this.accountService
      .changePassword(this.currentUser.email, currentPassword, newPassword)
      .subscribe(
        (response) => {
          this.router.navigate(['/profile']);
        },
        (error) => {
          this.error = error.error.message;
        }
      );

    this.passwordsDoNotMatch = false;
  }
}
