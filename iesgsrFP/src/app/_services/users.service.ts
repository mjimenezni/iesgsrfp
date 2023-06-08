import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Recupera todos los usuarios
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  // Recupera un usuario por su id
  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`);
  }

  // Crea un nuevo usuario
  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users`, user);
  }

  // Actualiza un usuario existente
  updateUser(userId: number, user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/${userId}`, user);
  }

  // Elimina un usuario existente
  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`);
  }

  getAllGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/groups`);
  }

  getGroupById(groupId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/groups/${groupId}`);
  }
}
