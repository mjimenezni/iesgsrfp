import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { NewsListComponent } from './news/news-list/news-list.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { AdminComponent } from './admin.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { NewsCreateComponent } from './news/news-create/news-create.component';
import { NewsDetailComponent } from './news/news-detail/news-detail.component';

import { RouterModule, Routes } from '@angular/router';

import { UsersDetailComponent } from './users/users-detail/users-detail.component';
import { UsersCreateComponent } from './users/users-create/users-create.component';
import { AdminRoutingModule } from './admin-routing.module';
import { NotesCreateComponent } from './notes/notes-create/notes-create.component';
import { NotesDetailComponent } from './notes/notes-detail/notes-detail.component';
import { NotesListComponent } from './notes/notes-list/notes-list.component';

import { EventsCreateComponent } from './calendar/events-create/events-create.component';
import { EventsDetailComponent } from './calendar/events-detail/events-detail.component';
import { EventsListComponent } from './calendar/events-list/events-list.component';

@NgModule({
  declarations: [
    NewsListComponent,
    AdminComponent,
    NewsCreateComponent,
    NewsDetailComponent,
    UsersListComponent,
    UsersDetailComponent,
    UsersCreateComponent,
    NotesCreateComponent,
    NotesDetailComponent,
    NotesListComponent,
    EventsCreateComponent,
    EventsDetailComponent,
    EventsListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AdminRoutingModule,
  ],
  exports: [RouterModule],
  providers: [DatePipe],
})
export class AdminModule {}
