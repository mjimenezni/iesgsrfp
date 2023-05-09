import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../_models';
import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private isAdmin = new BehaviorSubject<boolean>(false);
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  get isLoggedIn() {
    // devuelve un observable para que los componentes puedan suscribirse
    return this.loggedIn.asObservable();
  }

  get isAdminUser() {
    // añadimos un nuevo método para obtener la información de isAdmin
    return this.isAdmin.asObservable();
  }

  //Establece el token y actualiza el estado de inicio de sesión
  public setToken(token: string): void {
    const decodedToken = jwt_decode(token) as {
      idusuario: number;
      isAdmin: boolean;
    };
    localStorage.setItem('token', token); // almacena el token en el almacenamiento local
    this.loggedIn.next(true); // actualiza el estado de inicio de sesión a verdadero
    this.isAdmin.next(decodedToken.isAdmin); // actualiza el valor de isAdmin en el BehaviorSubject
  }
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }
  logout(): void {
    // Eliminar el token almacenado en localStorage
    localStorage.removeItem('token');
  }
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }
}
