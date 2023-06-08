import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarService } from 'src/app/_services/calendar.service';
import { Event } from 'src/app/_models/event';
import { Group } from 'src/app/_models/group';
import { UserService } from 'src/app/_services/users.service';

@Component({
  selector: 'app-events-create',
  templateUrl: './events-create.component.html',
  styleUrls: ['./events-create.component.css'],
})
export class EventsCreateComponent {
  eventForm: FormGroup;
  submitted = false;
  grupos: Group[] | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private calendarService: CalendarService,
    private router: Router,
    private datePipe: DatePipe,
    private usersService: UserService
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
    this.usersService.getAllGroups().subscribe((groups) => {
      this.grupos = groups;
    });
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

    this.calendarService.createEvent(event).subscribe(() => {
      this.router.navigate(['/admin/calendar']);
    });
  }
}
