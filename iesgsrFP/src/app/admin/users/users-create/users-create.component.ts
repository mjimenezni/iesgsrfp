import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/users.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Group } from 'src/app/_models/group';

@Component({
  selector: 'app-users-create',
  templateUrl: './users-create.component.html',
  styleUrls: ['./users-create.component.css'],
})
export class UsersCreateComponent {
  usersForm: FormGroup;
  submitted = false;
  error: string = '';
  grupos: Group[] | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UserService,
    private router: Router
  ) {
    this.usersForm = this.formBuilder.group({
      email: ['', Validators.required],
      nombre: ['', Validators.required],
      password: ['', Validators.required],
      isAdmin: [false, Validators.required],
      idgrupo: new FormControl('', Validators.required),
    });
  }
  ngOnInit(): void {
    this.usersService.getAllGroups().subscribe((groups) => {
      this.grupos = groups;
    });
  }
  get f() {
    return this.usersForm.controls;
  }

  onSubmit() {
    const user: User = {
      email: this.f.email.value,
      nombre: this.f.nombre.value,
      password: this.f.password.value,
      isAdmin: this.f.isAdmin.value,
      idgrupo: this.f.idgrupo.value,
    };

    this.submitted = true;
    if (this.usersForm.invalid) {
      return;
    }

    this.usersService.createUser(user).subscribe(
      () => {
        this.router.navigate(['/admin/users']);
      },
      (error) => {
        // El registro ha fallado, mostrar un mensaje de error al usuario
        this.error = error.error.message;
      }
    );
  }
}
