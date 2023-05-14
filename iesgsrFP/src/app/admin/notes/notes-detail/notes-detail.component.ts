import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotesService } from 'src/app/_services/notes.service';
import { Note } from 'src/app/_models/note';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

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

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private notesService: NotesService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    //muestra los valores actuales en el formulario
    this.notesService.getNoteById(id).subscribe((data: Note) => {
      this.nota = data;
      this.notesForm.patchValue({
        titulo: this.nota.titulo,
        fecha: this.datePipe.transform(this.nota.fecha, 'yyyy-MM-dd'),
        contenido: this.nota.contenido,
      });
    });

    this.notesForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      fecha: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
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

  onSubmit() {
    this.submitted = true;

    if (this.notesForm.invalid) {
      return;
    }

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
