import { Component } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { UserService } from '../_services/users.service';
import { AccountService } from '../_services';
import esLocale from '@fullcalendar/core/locales/es';
import { Event } from '../_models/event';
import { CalendarService } from '../_services/calendar.service';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  nombreGrupo: string = '';
  currentUser: any;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    locale: esLocale,
    headerToolbar: {
      right: 'prev,next today', // Botones de navegación
      center: 'title', // Título del calendario
      left: 'dayGridMonth', // Botones de cambio de vista
    },
  };

  eventos: Event[] | undefined;
  constructor(
    private calendarService: CalendarService,
    private userService: UserService,
    private accountService: AccountService
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
    this.calendarService
      .getGroupEvents(this.currentUser.idgrupo)
      .subscribe((eventos) => {
        const calendarEvents: EventInput[] = eventos.map((evento) => ({
          title: evento.evento,
          start: evento.fecha as Date,
        }));
        this.eventos = eventos;

        // Actualiza solo el atributo 'events' del objeto calendarOptions existente
        this.calendarOptions.events = calendarEvents;
      });
  }
}
