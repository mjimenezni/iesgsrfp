import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/users.service';
import { User } from 'src/app/_models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.css'],
})
export class UsersDetailComponent {
  usersForm!: FormGroup;
  submitted = false;
  id: number | undefined;
  usuario: User = new User();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    //muestra los valores actuales en el formulario
    this.userService.getUserById(id).subscribe((data: User) => {
      this.usuario = data;
      this.usersForm.patchValue({
        nombre: this.usuario.nombre,
        email: this.usuario.email,
      });
    });

    this.usersForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
    });

    this.userService.getUserById(id).subscribe(
      (usuario) => {
        this.usuario = usuario;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  get f() {
    return this.usersForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.usersForm.invalid) {
      return;
    }

    if (this.usuario.idusuario !== undefined) {
      this.userService
        .updateUser(this.usuario.idusuario, this.usersForm.value)
        .subscribe(() => {
          // success message
          this.router.navigate(['/admin/users']);
        });
    }
  }

  onCancel() {
    this.router.navigate(['/admin/users']);
  }
}
