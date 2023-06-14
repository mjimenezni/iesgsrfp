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

  private usersSubject = new BehaviorSubject<any[]>([]);
  users$ = this.usersSubject.asObservable();

  private selectedUserSource = new BehaviorSubject<User | null>(null);
  selectedUser$ = this.selectedUserSource.asObservable();

  constructor(accountService: AccountService) {
    this.accountService = accountService;
  }

  selectUser(user: User) {
    this.selectedUserSource.next(user);
  }
  updateUsers(users: any[]): void {
    this.usersSubject.next(users);
  }

  public connect(idusuario: number): void {
    this.socket = io(environment.apiUrl, { auth: { token: idusuario } });
    // Unirse a un canal específico
    const channel = idusuario;
    this.socket.emit('join', channel);
  }

  public disconnect(): void {
    this.socket.disconnect();
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
      this.socket.emit('get messages', { idorigen, iddestino });
      this.socket.on('messages', (messages: any[]) => {
        observer.next(messages);
      });
    });
  }

  getUnreadMessagesCount(iddestino: number): void {
    this.socket.emit('getUnreadMessagesCount', { iddestino });
  }

  receiveUnreadMessagesCount(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('unreadMessagesCount', (data: any) => {
        observer.next(data);
      });
    });
  }
}
