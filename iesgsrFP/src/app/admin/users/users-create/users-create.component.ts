import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.css'],
})
export class UsersCreateComponent {
  usersForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UserService,
    private router: Router
  ) {
    this.usersForm = this.formBuilder.group({
      email: ['', Validators.required],
      nombre: ['', Validators.required],
      password: ['', Validators.required],
      isAdmin: ['', Validators.required],
    });
  }
  get f() {
    return this.usersForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.usersForm.invalid) {
      return;
    }

    const user: User = {
      email: this.f.email.value,
      nombre: this.f.nombre.value,
      password: this.f.password.value,
      isAdmin: this.f.isAdmin.value,
    };

    this.usersService.createUser(user).subscribe(() => {
      this.router.navigate(['/admin/users']);
    });
  }
}
