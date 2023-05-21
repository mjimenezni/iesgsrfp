import { Component } from '@angular/core';
import { Note } from 'src/app/_models/note';
import { NotesService } from 'src/app/_services/notes.service';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
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
  notasGrupoCargadas: boolean = false;
  deleteConfirmation = false;

  constructor(private notesService: NotesService, private router: Router) {}

  ngOnInit() {
    this.getNotes();
  }

  getNotes() {
    this.notesService.getAllNotes().subscribe((notas) => {
      this.notas = notas;
      this.notasGrupoCargadas = false;
      notas.forEach((nota) => {
        if (nota.idnota) {
          this.notesService.getGroupNotes(nota.idnota).subscribe((grupos) => {
            this.notasGrupo.push(grupos);
            if (this.notasGrupo.length == notas.length) {
              this.notasGrupoCargadas = true;
            }
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
