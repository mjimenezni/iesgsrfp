import { Component, OnInit } from '@angular/core';
import { ChatService } from '../_services/chat.service';
import { UserService } from '../_services/users.service';
import {
  faSearch,
  faPaperclip,
  faSmile,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  faSearch = faSearch;
  faPaperclip = faPaperclip;
  faSmile = faSmile;

  users: any[] = [];

  constructor(
    private chatService: ChatService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.getUsers();
  }
  getUsers(): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }
}
