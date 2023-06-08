import { Component } from '@angular/core';
import { CalendarService } from 'src/app/_services/calendar.service';
import { Event } from 'src/app/_models/event';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {
  faTrash,
  faPencil,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.css'],
})
export class EventsListComponent {
  faTrash = faTrash;
  faPencil = faPencil;
  faUserPlus = faUserPlus;
  eventos: Event[] | undefined;
  nuevoEvento: Event = new Event();
  deleteConfirmation = false;

  constructor(
    private calendarService: CalendarService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.calendarService.getAllEvents().subscribe((eventos) => {
      // Formatear la fecha de cada evento
      eventos.forEach((evento) => {
        evento.fecha = this.datePipe.transform(evento.fecha, 'dd/MM/yyyy');
      });
      this.eventos = eventos;
    });
  }

  deleteEvent(id: number) {
    this.calendarService.deleteEvent(id).subscribe(
      () => {
        this.getEvents();
      },
      (error) => {
        console.error(error);
        // Manejar el error en caso de que la eliminación del evento falle
      }
    );
  }

  confirmDelete(id: number) {
    const confirmation = window.confirm('¿Estás seguro de eliminar el evento?');
    if (confirmation) {
      this.deleteEvent(id);
      this.deleteConfirmation = false;
    }
  }

  editEvent(id: number) {
    this.router.navigate(['/admin/calendar', id, 'edit']);
  }
}
