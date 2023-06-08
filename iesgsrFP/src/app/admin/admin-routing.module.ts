import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UsersCreateComponent } from './users/users-create/users-create.component';
import { UsersDetailComponent } from './users/users-detail/users-detail.component';
import { NewsCreateComponent } from './news/news-create/news-create.component';
import { NewsDetailComponent } from './news/news-detail/news-detail.component';
import { NewsListComponent } from './news/news-list/news-list.component';
import { AuthGuard } from '../_helpers/auth.guard';
import { NotesListComponent } from './notes/notes-list/notes-list.component';
import { NotesCreateComponent } from './notes/notes-create/notes-create.component';
import { NotesDetailComponent } from './notes/notes-detail/notes-detail.component';
import { EventsListComponent } from './calendar/events-list/events-list.component';
import { EventsDetailComponent } from './calendar/events-detail/events-detail.component';
import { EventsCreateComponent } from './calendar/events-create/events-create.component';
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'news', component: NewsListComponent },
      { path: 'users', component: UsersListComponent },
      { path: 'users/create', component: UsersCreateComponent },
      { path: 'users/:id/edit', component: UsersDetailComponent },
      { path: 'news/create', component: NewsCreateComponent },
      { path: 'news/:id/edit', component: NewsDetailComponent },
      { path: 'notes', component: NotesListComponent },
      { path: 'notes/create', component: NotesCreateComponent },
      { path: 'notes/:id/edit', component: NotesDetailComponent },
      { path: 'calendar', component: EventsListComponent },
      { path: 'calendar/:id/edit', component: EventsDetailComponent },
      { path: 'calendar/create', component: EventsCreateComponent },
      { path: '', component: UsersListComponent },
      { path: '', component: UsersListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
