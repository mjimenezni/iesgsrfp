import { Component } from '@angular/core';
import { NotesService } from '../_services/notes.service';
import { Note } from '../_models/note';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent {
  notes: Note[] | undefined;
  constructor(private notesService: NotesService) {}
  ngOnInit(): void {
    this.notesService.getAllNotes().subscribe((notes) => {
      this.notes = notes;
    });
  }
}
