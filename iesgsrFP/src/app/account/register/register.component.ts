import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService } from 'src/app/_services';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  error: string = '';
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', Validators.required],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
        nombre: [''],
        ape1: [''],
      },
      { validator: this.passwordsMatch }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  passwordsMatch(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      console.log('Las contraseñas no son son iguales');
      return { passwordMismatch: true };
    }
    // Verificar que la validación de contraseñas esté activa
    if (
      confirmPassword &&
      (confirmPassword.dirty || confirmPassword.touched) &&
      !confirmPassword.errors?.passwordMismatch
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
    }
    return null;
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    const user: User = {
      email: this.f.email.value,
      password: this.f.password.value,
      nombre: this.f.nombre.value,
      ape1: this.f.ape1.value,
      isAdmin: false,
    };
    this.accountService.register(user).subscribe(
      (response) => {
        window.alert(
          'Usuario creado correctamente. Introduce tus datos en el login.'
        );
        this.router.navigate(['/login']);
      },
      (error) => {
        // El registro ha fallado, mostrar un mensaje de error al usuario
        this.error = error.error.message;
      }
    );
  }
}
