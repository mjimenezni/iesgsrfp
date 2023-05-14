import { Injectable } from '@angular/core';
//Hacer peticición usando sockets
//import io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { New } from '../_models/new';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  //private socket: any;
  public noticias: New[] | undefined;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    // Crea una instancia de Socket.IO para conectarte al servidor
    //this.socket = io('http://localhost:8000');
  }
  getAllNews() {
    return this.http.get<New[]>(`${this.apiUrl}/noticias`).pipe(
      map((noticias) => {
        noticias.forEach((noticia) => {
          if (noticia.fecha) {
            //Formatear la la fecha
            /*noticia.fecha = this.datePipe.transform(
              noticia.fecha,
              'yyyy-MM-dd'
            );*/
          }
        });
        this.noticias = noticias;
        return noticias;
      })
    );

    //Usando sockets
    /*this.socket.emit('getNews');
    return new Promise((resolve, reject) => {
      this.socket.emit('getNews');
      this.socket.on('newsData', (data: any) => {
        resolve(data);
      });
      this.socket.on('error', (error: any) => {
        reject(error);
      });
    });*/
  }
  getNewsById(id: number): Observable<New> {
    const url = `${this.apiUrl}/noticias/${id}`;
    return this.http.get<New>(url);
  }
  createNews(news: New): Observable<New> {
    return this.http.post<New>(`${this.apiUrl}/noticias`, news);
  }
  deleteNews(id: number): Observable<any> {
    const url = `${this.apiUrl}/noticias/${id}`;
    return this.http.delete(url);
  }
  updateNews(id: number, news: New): Observable<any> {
    const url = `${this.apiUrl}/noticias/${id}`;
    return this.http.put(url, news);
  }
}
