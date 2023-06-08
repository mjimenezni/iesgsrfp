import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/_services';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/users.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
})
export class ProfileEditComponent implements OnInit {
  editForm: FormGroup;
  submitted = false;
  currentUser: any;
  datosUser: any;
  avatarOptions: string[] = [
    'assets/img/avatar/ava1-bg.webp',
    'assets/img/avatar/ava2-bg.webp',
    'assets/img/avatar/ava3-bg.webp',
    'assets/img/avatar/ava4-bg.webp',
    'assets/img/avatar/ava5-bg.webp',
    'assets/img/avatar/ava6-bg.webp',
  ];
  selectedAvatar: string | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private userService: UserService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.editForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      ape1: [''],
      ape2: [''],
      email: [''],
      telefono: [''],
      fecha_nac: [''],
      avatar: [null],
      isAdmin: [''],
      idgrupo: [''],
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
          this.editForm.patchValue({
            nombre: user.nombre,
            ape1: user.ape1,
            ape2: user.ape2,
            email: user.email,
            telefono: user.telefono,
            fecha_nac: this.datePipe.transform(user.fecha_nac, 'yyyy-MM-dd'),
            avatar: user.avatar,
            isAdmin: user.isAdmin,
            idgrupo: user.idgrupo,
          });
        },
        (error) => {
          console.log('Error al cargar los datos del usuario', error);
        }
      );
    }
  }
  get f() {
    return this.editForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    console.log(this.editForm);
    if (this.editForm.invalid) {
      return;
    }

    // Obtiene los valores actualizados del formulario
    const updatedUserData = this.editForm.value;
    updatedUserData.avatar = this.selectedAvatar;

    // Verifica si no se ha seleccionado una nueva imagen de avatar
    if (!updatedUserData.avatar) {
      updatedUserData.avatar = this.currentUser.avatar;
    }

    // Realiza la llamada al servicio para actualizar los datos del usuario
    this.userService
      .updateUser(this.currentUser.idusuario, updatedUserData)
      .subscribe(
        (response) => {
          // Llama a getUserById para obtener los datos actualizados del usuario
          this.userService.getUserById(this.currentUser.idusuario).subscribe(
            (user) => {
              this.datosUser = user;

              // Actualiza el avatar en el servicio AccountService
              this.accountService
                .setAvatar(this.datosUser.avatar)
                .subscribe(() => {});

              // Establece el token y actualiza el estado de inicio de sesión y isAdmin
              this.accountService.setToken(response.token);
              this.router.navigate(['/profile']);
            },
            (error) => {
              console.log(
                'Error al obtener los datos actualizados del usuario',
                error
              );
            }
          );
        },
        (error) => {
          console.log('Error al actualizar los datos del usuario', error);
        }
      );
  }
  selectAvatar(option: string): void {
    this.selectedAvatar = option;
    this.editForm.get('avatar')?.setValue(option);
  }
}
