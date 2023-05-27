import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
//import { ErrorInterceptor } from './_helpers/error.interceptor';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { ChatComponent } from './chat/chat.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewsComponent } from './news/news.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './calendar/calendar.component';
import { NotesComponent } from './notes/notes.component';
import { AdminModule } from './admin/admin.module';
import { ChatRoomComponent } from './chat/chat-room/chat-room.component';
import { ProfileCardComponent } from './profile/profile-card/profile-card.component';
import { ProfileEditComponent } from './profile/profile-edit/profile-edit.component';
import { ProfilePasswordComponent } from './profile/profile-password/profile-password.component';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    ChatComponent,
    NewsComponent,
    CalendarComponent,
    NotesComponent,
    ChatRoomComponent,
    ProfileCardComponent,
    ProfileEditComponent,
    ProfilePasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FullCalendarModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
