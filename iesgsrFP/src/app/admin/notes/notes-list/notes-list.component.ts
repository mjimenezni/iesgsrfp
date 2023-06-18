import { Component } from '@angular/core';
import { Note } from 'src/app/_models/note';
import { NotesService } from 'src/app/_services/notes.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  faTrash,
  faPencil,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.css'],
})
export class NotesListComponent {
  faTrash = faTrash;
  faPencil = faPencil;
  faUserPlus = faUserPlus;
  notas: Note[] = [];
  notasGrupo: any[][] = []; //lista de grupos asociados a cada nota
  nuevaNota: Note = new Note();
  deleteConfirmation = false;

  constructor(
    private notesService: NotesService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getNotes();
  }

  getNotes() {
    this.notesService.getAllNotes().subscribe((notas) => {
      // Formatear la fecha de cada nota
      notas.forEach((nota) => {
        nota.fecha = this.datePipe.transform(nota.fecha, 'dd/MM/yyyy');
      });
      this.notas = notas;

      notas.forEach((nota) => {
        if (nota.idnota) {
          this.notesService.getGroupNotes(nota.idnota).subscribe((grupos) => {
            this.notasGrupo.push(grupos);
          });
        }
      });
    });
  }

  deleteNote(id: number) {
    this.notesService.deleteNote(id).subscribe(
      () => {
        this.getNotes();
      },
      (error) => {
        console.error(error);
        // Manejar el error en caso de que la eliminación de la nota falle
      }
    );
  }

  confirmDelete(id: number) {
    const confirmation = window.confirm('¿Estás seguro de eliminar la nota?');
    if (confirmation) {
      this.deleteNote(id);
      this.deleteConfirmation = false;
    }
  }

  editNote(id: number) {
    this.router.navigate(['/admin/notes', id, 'edit']);
  }
}
