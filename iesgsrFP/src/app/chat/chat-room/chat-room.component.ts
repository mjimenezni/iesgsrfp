import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../_services/chat.service';
import { AccountService } from 'src/app/_services';
import {
  faPaperclip,
  faSmile,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/_models/user';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css'],
})
export class ChatRoomComponent implements OnInit {
  faPaperclip = faPaperclip;
  faSmile = faSmile;
  faPaperplane = faPaperPlane;

  currentUser: any;
  selectedUser?: User | null;

  users: any[] = [];

  messages: any[] = []; //recupera los mensajes de la B.D.

  messageInput: string = '';
  constructor(
    private datePipe: DatePipe,
    private chatService: ChatService,
    private accountService: AccountService
  ) {}
  ngOnInit(): void {
    this.accountService.currentUser.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });

    this.chatService.users$.subscribe((users) => {
      this.users = users;
    });

    this.chatService.selectedUser$.subscribe((user) => {
      this.selectedUser = user;

      if (this.selectedUser?.idusuario) {
        const receiverId = this.selectedUser.idusuario;

        this.updateUnreadCount(this.selectedUser.idusuario);

        this.chatService
          .getMessages(this.currentUser.idusuario, receiverId || 0)
          .subscribe((messages) => {
            this.messages = messages;
          });
      }
    });
    this.chatService.receiveMessageFromUser().subscribe((data: any) => {
      this.messages.push(data);

      if (data.idorigen) this.updateUnreadCount(data.idorigen);
    });
  }

  sendMessage() {
    const message = {
      mensaje: this.messageInput,
      iddestino: this.selectedUser?.idusuario,
      idorigen: this.currentUser.idusuario,
      fechahora: new Date(),
      leido: false,
    };

    this.chatService.sendMessageToUser(message);
    this.messages.push(message);
    this.messageInput = '';
  }

  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const format = 'dd/MMM hh:mm a';
    const formattedDateTime = this.datePipe.transform(date, format);
    return formattedDateTime || ''; // Devuelve una cadena vacía si el valor es nulo
  }

  updateUnreadCount(userId: number): void {
    const user = this.users.find((user) => user.idusuario === userId);
    if (user) {
      if (user === this.selectedUser && user.unreadCount) {
        user.unreadCount = 0;
      } else if (user !== this.selectedUser) {
        user.unreadCount = user.unreadCount ? user.unreadCount + 1 : 1;
      }
    }
  }
}
