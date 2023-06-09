import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotesService } from 'src/app/_services/notes.service';
import { UserService } from 'src/app/_services/users.service';
import { Note } from 'src/app/_models/note';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Group } from 'src/app/_models/group';

@Component({
  selector: 'app-notes-detail',
  templateUrl: './notes-detail.component.html',
  styleUrls: ['./notes-detail.component.css'],
})
export class NotesDetailComponent {
  notesForm!: FormGroup;
  submitted = false;
  id: number | undefined;
  nota: Note = new Note();
  grupos: Group[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notesService: NotesService,
    private usersService: UserService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.usersService.getAllGroups().subscribe((groups) => {
      this.grupos = groups;
    });

    //muestra los valores actuales en el formulario
    this.notesService.getNoteById(id).subscribe((data: Note) => {
      this.nota = data;
      this.notesForm.patchValue({
        titulo: this.nota.titulo,
        fecha: this.datePipe.transform(this.nota.fecha, 'yyyy-MM-dd'),
        contenido: this.nota.contenido,
        grupos: this.nota.grupos,
      });
    });

    this.notesForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      fecha: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      grupos: this.formBuilder.array([]),
    });

    this.notesService.getNoteById(id).subscribe(
      (nota) => {
        this.nota = nota;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  get f() {
    return this.notesForm.controls;
  }

  get gruposFormArray() {
    return this.notesForm.get('grupos') as FormArray;
  }

  //comprueba que al menos haya un grupo seleccionado
  get gruposSeleccionados(): boolean {
    return this.gruposFormArray.controls.some((control) => control.value);
  }

  onGrupoCheckboxChange(event: any) {
    const gruposFormArray = this.notesForm.get('grupos') as FormArray;

    if (event.target.checked) {
      gruposFormArray.push(this.formBuilder.control(event.target.value));
    } else {
      const index = gruposFormArray.controls.findIndex(
        (control) => control.value === event.target.value
      );
      gruposFormArray.removeAt(index);
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.notesForm.invalid) {
      return;
    }

    //console.log(this.notesForm);

    if (this.nota.idnota !== undefined) {
      this.notesService
        .updateNote(this.nota.idnota, this.notesForm.value)
        .subscribe(
          (data) => {
            // success message
            this.router.navigate(['/admin/notes']);
          },
          (error) => {
            console.error(error);
            // show error message to user
          }
        );
    }
  }

  onCancel() {
    this.router.navigate(['/admin/notes']);
  }
}
