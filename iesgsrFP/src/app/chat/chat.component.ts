import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../_services/chat.service';
import { UserService } from '../_services/users.service';
import { AccountService } from '../_services';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { User } from '../_models/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  faSearch = faSearch;

  currentUser: any;

  users: any[] = [];

  sentMessages: any[] = [];
  receivedMessages: any[] = [];

  constructor(
    private chatService: ChatService,
    private userService: UserService,
    private accountService: AccountService
  ) {}
  ngOnInit(): void {
    this.getUsers();

    this.accountService.currentUser.subscribe((currentUser) => {
      this.currentUser = currentUser;
    });
    this.chatService.connect();
  }
  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

  getUsers(): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.users = users;
    });
  }
  selectUser(user: User) {
    this.chatService.selectUser(user);
  }
}
