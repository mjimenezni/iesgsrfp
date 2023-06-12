import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  activeTab: number = 0;

  constructor() {}

  ngOnInit() {
    // Verificar si hay un estado guardado en localStorage
    const storedTab = localStorage.getItem('activeTab');
    if (storedTab) {
      // Restaurar el estado de la pestaña activa desde localStorage
      this.activeTab = parseInt(storedTab, 10);
    } else {
      // Si no hay un estado guardado, establecer la primera pestaña como activa
      this.activeTab = 0;
    }
  }

  setActiveTab(index: number) {
    this.activeTab = index;
    // Guardar el estado de la pestaña activa en localStorage
    localStorage.setItem('activeTab', index.toString());
  }
}
