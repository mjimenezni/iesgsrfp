import { Component } from '@angular/core';
import { NewsService } from 'src/app/_services';
import { New } from 'src/app/_models/new';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

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
  noticias: New[] | undefined;
  nuevaNoticia: New = new New();
  deleteConfirmation = false;

  constructor(
    private newsService: NewsService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getNews();
  }

  getNews() {
    this.newsService.getAllNews().subscribe((noticias) => {
      // Formatear la fecha de cada noticia
      noticias.forEach((noticia) => {
        noticia.fecha = this.datePipe.transform(noticia.fecha, 'dd/MM/yyyy');
      });
      this.noticias = noticias;
    });
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
