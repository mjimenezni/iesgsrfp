import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  activeTab: number = 0;

  constructor() {}

  setActiveTab(index: number) {
    this.activeTab = index;
  }
}
