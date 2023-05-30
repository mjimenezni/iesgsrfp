import { Injectable } from '@angular/core';
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

  constructor(private http: HttpClient) {}
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
  }
  getNewsById(id: number): Observable<New> {
    const url = `${this.apiUrl}/noticias/${id}`;
    return this.http.get<New>(url);
  }
  createNews(news: New, imageFile: File | null): Observable<New> {
    const formData = new FormData();
    if (imageFile) {
      formData.append('imagen', imageFile);
    }
    if (news.titulo) {
      formData.append('titulo', news.titulo);
    }
    if (news.fecha) {
      formData.append('fecha', news.fecha.toString());
    }
    if (news.contenido) {
      formData.append('contenido', news.contenido);
    }

    return this.http.post<any>(`${this.apiUrl}/noticias`, formData);
  }
  deleteNews(id: number): Observable<any> {
    const url = `${this.apiUrl}/noticias/${id}`;
    return this.http.delete(url);
  }
  updateNews(id: number, news: New, imageFile: File | null): Observable<any> {
    const url = `${this.apiUrl}/noticias/${id}`;
    const formData = new FormData();
    if (imageFile) {
      formData.append('imagen', imageFile);
    }
    if (news.titulo) {
      formData.append('titulo', news.titulo);
    }
    if (news.fecha) {
      formData.append('fecha', news.fecha.toString());
    }
    if (news.contenido) {
      formData.append('contenido', news.contenido);
    }

    return this.http.put(url, formData);
  }
}
