import { Component } from '@angular/core';
import { Note } from 'src/app/_models/note';
import { NotesService } from 'src/app/_services/notes.service';
import { UserService } from 'src/app/_services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Group } from 'src/app/_models/group';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-notes-create',
  templateUrl: './notes-create.component.html',
  styleUrls: ['./notes-create.component.css'],
})
export class NotesCreateComponent {
  noteForm: FormGroup;
  submitted = false;
  grupos: Group[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private notesService: NotesService,
    private router: Router,
    private datePipe: DatePipe,
    private usersService: UserService
  ) {
    this.noteForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      fecha: [
        this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        Validators.required,
      ],
      grupos: this.formBuilder.array([]),
    });
  }

  get gruposFormArray() {
    return this.noteForm.get('grupos') as FormArray;
  }

  //comprueba que al menos haya un grupo seleccionado
  get gruposSeleccionados(): boolean {
    return this.gruposFormArray.controls.some((control) => control.value);
  }

  onGrupoCheckboxChange(event: any) {
    const gruposFormArray = this.noteForm.get('grupos') as FormArray;

    if (event.target.checked) {
      gruposFormArray.push(this.formBuilder.control(event.target.value));
    } else {
      const index = gruposFormArray.controls.findIndex(
        (control) => control.value === event.target.value
      );
      gruposFormArray.removeAt(index);
    }
  }

  ngOnInit(): void {
    this.usersService.getAllGroups().subscribe((groups) => {
      this.grupos = groups;
    });
  }

  get f() {
    return this.noteForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.noteForm.invalid) {
      return;
    }

    const note: Note = {
      titulo: this.f.titulo.value,
      fecha: this.f.fecha.value,
      contenido: this.f.contenido.value,
      grupos: this.f.grupos.value,
    };

    this.notesService.createNote(note).subscribe(() => {
      this.router.navigate(['/admin/notes']);
    });
  }
}
