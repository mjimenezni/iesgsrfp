import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Event } from '../_models/event';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  public eventos: Event[] | undefined;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getAllEvents() {
    return this.http.get<Event[]>(`${this.apiUrl}/events`).pipe(
      map((eventos) => {
        this.eventos = eventos;
        return eventos;
      })
    );
  }

  getEventById(id: number): Observable<Event> {
    const url = `${this.apiUrl}/events/${id}`;
    return this.http.get<Event>(url);
  }

  getGroupEvents(idgrupo: number): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/events/groups/${idgrupo}`);
  }

  deleteEvent(id: number): Observable<any> {
    const url = `${this.apiUrl}/events/${id}`;
    return this.http.delete(url);
  }

  updateEvent(id: number, event: Event): Observable<any> {
    const url = `${this.apiUrl}/events/${id}`;
    return this.http.put(url, event);
  }

  createEvent(event: Event): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/events`, event);
  }
}
