import { Component } from '@angular/core';
import { NotesService } from '../_services/notes.service';
import { Note } from '../_models/note';
import { AccountService } from '../_services';
import { UserService } from '../_services/users.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent {
  nombreGrupo: string = '';
  currentUser: any;
  notes: Note[] | undefined;

  constructor(
    private notesService: NotesService,
    private accountService: AccountService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.accountService.currentUser.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
    this.userService
      .getGroupById(this.currentUser.idgrupo)
      .subscribe((grupo) => {
        this.nombreGrupo = grupo.nombre;
      });

    // Obtener las notas del grupo del usuario actual
    this.notesService
      .getNotesByGroup(this.currentUser.idgrupo)
      .subscribe((groupNotes) => {
        this.notes = groupNotes;
      });
  }
}
