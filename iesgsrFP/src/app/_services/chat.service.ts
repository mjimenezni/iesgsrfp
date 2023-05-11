import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  accountService: AccountService;
  private socket: any;

  idorigen: number = 0;
  iddestino: number = 0;

  private selectedUserSource = new BehaviorSubject<User | null>(null);
  selectedUser$ = this.selectedUserSource.asObservable();

  constructor(accountService: AccountService) {
    this.accountService = accountService;
  }

  selectUser(user: User) {
    this.selectedUserSource.next(user);
  }

  public connect(): void {
    this.socket = io(environment.apiUrl);
    console.log('estoy conectado');
  }

  public disconnect(): void {
    this.socket.disconnect();
    console.log('me he desconectado');
  }

  public sendMessageToUser(message: any): void {
    this.socket.emit('private message', message);
  }

  public receiveMessageFromUser(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('private message', (data: any) => {
        observer.next(data);
      });
    });
  }

  public getMessages(idorigen: number, iddestino: number): Observable<any> {
    return new Observable<any>((observer) => {
      console.log('idorigen:', idorigen, 'iddestino:', iddestino);
      this.socket.emit('get messages', { idorigen, iddestino });
      this.socket.on('messages', (messages: any[]) => {
        observer.next(messages);
      });
    });
  }
}
