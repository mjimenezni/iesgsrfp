import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './account/login/login.component';
import { NewsComponent } from './news/news.component';
import { RegisterComponent } from './account/register/register.component';
import { CalendarComponent } from './calendar/calendar.component';
import { NotesComponent } from './notes/notes.component';
import { AuthGuard } from './_helpers/auth.guard';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  { path: 'index', component: IndexComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'news', component: NewsComponent },
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
  { path: 'notes', component: NotesComponent, canActivate: [AuthGuard] },
  //{ path: 'admin', component: AdminComponent },

  // en el resto de casos redirecciona al inicio
  //{ path: '**', redirectTo: 'index' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
