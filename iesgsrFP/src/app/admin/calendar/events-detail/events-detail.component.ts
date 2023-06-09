import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from 'src/app/_models/group';
import { CalendarService } from 'src/app/_services/calendar.service';
import { UserService } from 'src/app/_services/users.service';
import { Event } from 'src/app/_models/event';

@Component({
  selector: 'app-events-detail',
  templateUrl: './events-detail.component.html',
  styleUrls: ['./events-detail.component.css'],
})
export class EventsDetailComponent {
  eventForm: FormGroup;
  submitted = false;
  grupos: Group[] | undefined;
  evento: Event = new Event();

  constructor(
    private formBuilder: FormBuilder,
    private calendarService: CalendarService,
    private router: Router,
    private datePipe: DatePipe,
    private usersService: UserService,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.formBuilder.group({
      evento: ['', Validators.required],
      idgrupo: new FormControl('', Validators.required),
      fecha: [
        this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        Validators.required,
      ],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    //muestra los valores actuales en el formulario
    this.calendarService.getEventById(id).subscribe((data: Event) => {
      this.evento = data;
      this.eventForm.patchValue({
        evento: this.evento.evento,
        fecha: this.datePipe.transform(this.evento.fecha, 'yyyy-MM-dd'),
        idgrupo: this.evento.idgrupo,
      });
    });

    this.usersService.getAllGroups().subscribe((groups) => {
      this.grupos = groups;
    });

    this.calendarService.getEventById(id).subscribe(
      (evento) => {
        this.evento = evento;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  get f() {
    return this.eventForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.eventForm.invalid) {
      return;
    }

    const event: Event = {
      evento: this.f.evento.value,
      fecha: this.f.fecha.value,
      idgrupo: this.f.idgrupo.value,
    };
    if (this.evento.idevento !== undefined) {
      this.calendarService
        .updateEvent(this.evento.idevento, event)
        .subscribe(() => {
          this.router.navigate(['/admin/calendar']);
        });
    }
  }
}
