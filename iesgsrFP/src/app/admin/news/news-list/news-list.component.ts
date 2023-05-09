import { Component } from '@angular/core';
import { NewsService } from 'src/app/_services';
import { News } from 'src/app/_models/news';
import { Router } from '@angular/router';

import {
  faTrash,
  faPencil,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css'],
})
export class NewsListComponent {
  faTrash = faTrash;
  faPencil = faPencil;
  faUserPlus = faUserPlus;
  noticias: News[] | undefined;
  nuevaNoticia: News = new News();
  deleteConfirmation = false;

  constructor(private newsService: NewsService, private router: Router) {}

  ngOnInit() {
    this.getNews();
  }

  getNews() {
    this.newsService.getAllNews().subscribe((noticias) => {
      this.noticias = noticias;
    });
  }

  createNew() {
    this.newsService.createNews(this.nuevaNoticia).subscribe(
      () => {
        this.nuevaNoticia = new News(); // limpiar los valores del formulario
        this.getNews(); // obtener las noticias actualizadas después de la creación
      },
      (error) => console.error(error)
    );
  }

  deleteNew(id: number) {
    this.newsService.deleteNews(id).subscribe(
      () => {
        this.getNews();
      },
      (error) => {
        console.error(error);
        // Manejar el error en caso de que la eliminación de la noticia falle
      }
    );
  }

  confirmDelete(id: number) {
    const confirmation = window.confirm(
      '¿Estás seguro de eliminar la noticia?'
    );
    if (confirmation) {
      this.deleteNew(id);
      this.deleteConfirmation = false;
    }
  }

  editNew(id: number) {
    this.router.navigate(['/admin/news', id, 'edit']);
  }
}
