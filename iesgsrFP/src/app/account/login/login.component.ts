import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  submitted = false;
  error: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }
    this.accountService
      .login(this.f.email.value, this.f.password.value)
      .subscribe(
        (response) => {
          // Establece el token y actualiza el estado de inicio de sesión y isAdmin
          this.accountService.setToken(response.token);
          // Redirige al usuario a la página de inicio
          this.router.navigate(['/']);
        },
        (error) => {
          // El inicio de sesión ha fallado, mostrar un mensaje de error al usuario
          this.error = error.error.message;
        }
      );
  }
}
