import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Note } from '../_models/note';
import { Group } from '../_models/group';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  public notes: Note[] | undefined;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllNotes() {
    return this.http.get<Note[]>(`${this.apiUrl}/notes`).pipe(
      map((notes) => {
        this.notes = notes;
        return notes;
      })
    );
  }

  getNoteById(id: number): Observable<Note> {
    const url = `${this.apiUrl}/notes/${id}`;
    return this.http.get<Note>(url);
  }
  getGroupNotes(idnota: number): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/notes/groups/${idnota}`);
  }

  updateNote(id: number, note: Note): Observable<any> {
    const url = `${this.apiUrl}/notes/${id}`;
    return this.http.put(url, note);
  }

  createNote(note: Note): Observable<Note> {
    return this.http.post<Note>(`${this.apiUrl}/notes`, note);
  }

  deleteNote(id: number): Observable<any> {
    const url = `${this.apiUrl}/notes/${id}`;
    return this.http.delete(url);
  }
}
