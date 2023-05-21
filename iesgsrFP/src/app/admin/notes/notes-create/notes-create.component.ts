import { Component } from '@angular/core';
import { Note } from 'src/app/_models/note';
import { NotesService } from 'src/app/_services/notes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notes-create',
  templateUrl: './notes-create.component.html',
  styleUrls: ['./notes-create.component.css'],
})
export class NotesCreateComponent {
  noteForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private notesService: NotesService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.noteForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      fecha: [
        this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        Validators.required,
      ],
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
    };

    this.notesService.createNote(note).subscribe(() => {
      this.router.navigate(['/admin/notes']);
    });
  }
}
