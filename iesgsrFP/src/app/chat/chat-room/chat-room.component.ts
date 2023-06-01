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
    this.chatService.selectedUser$.subscribe((user) => {
      this.selectedUser = user;
      if (this.selectedUser) {
        const receiverId = this.selectedUser.idusuario;

        this.chatService
          .getMessages(this.currentUser.idusuario, receiverId || 0)
          .subscribe((messages) => {
            this.messages = messages;
          });
      }
    });
    this.chatService.receiveMessageFromUser().subscribe((data: any) => {
      this.messages.push(data);
    });
  }

  sendMessage() {
    const message = {
      mensaje: this.messageInput,
      iddestino: this.selectedUser?.idusuario,
      idorigen: this.currentUser.idusuario,
      fechahora: new Date(),
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
}
