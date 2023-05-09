import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: any;

  constructor() {}
  public connect(): void {
    this.socket = io(environment.apiUrl);
  }

  public disconnect(): void {
    this.socket.disconnect();
  }

  public sendMessage(fromId: number, toId: number, message: string): void {
    this.socket.emit('message', { fromId, toId, message });
  }

  public receiveMessage(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socket.on('message', (data: any) => {
        observer.next(data);
      });
    });
  }
}
