import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import jwt_decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private isAdmin = new BehaviorSubject<boolean>(false);
  private apiUrl = environment.apiUrl;
  private decodedToken = new BehaviorSubject<any>(null);
  private avatarChanged = new Subject<string>();

  public avatarChanged$ = this.avatarChanged.asObservable();

  constructor(private http: HttpClient) {}
  get isLoggedIn() {
    // devuelve un observable para que los componentes puedan suscribirse
    return this.loggedIn.asObservable();
  }

  get isAdminUser() {
    // añadimos un nuevo método para obtener la información de isAdmin
    return this.isAdmin.asObservable();
  }
  get currentUser(): Observable<any> {
    return this.decodedToken.asObservable();
  }

  //Establece el token y actualiza el estado de inicio de sesión
  public setToken(token: string): void {
    const decodedToken = jwt_decode(token) as {
      idusuario: number;
      isAdmin: boolean;
      nombre: string;
      avatar: string;
    };
    localStorage.setItem('token', token); // almacena el token en el almacenamiento local

    this.loggedIn.next(true); // actualiza el estado de inicio de sesión a verdadero
    this.isAdmin.next(decodedToken.isAdmin); // actualiza el valor de isAdmin en el BehaviorSubject
    this.decodedToken.next(decodedToken);
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
  public setAvatar(avatar: string): Observable<any> {
    const updatedToken = this.decodedToken.value;
    updatedToken.avatar = avatar;
    this.decodedToken.next(updatedToken);
    this.avatarChanged.next(avatar);

    return of(null);
  }

  changePassword(
    email: string,
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    return this.login(email, currentPassword).pipe(
      switchMap(() => {
        const body = {
          email: email,
          newPassword: newPassword,
        };
        return this.http.put<any>(`${this.apiUrl}/users/change-password`, body);
      })
    );
  }
}
