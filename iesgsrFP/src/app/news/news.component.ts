import { Component } from '@angular/core';
import { NewsService } from '../_services/news.service';
import { New } from '../_models/new';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent {
  noticias: New[] | undefined;
  constructor(private newsService: NewsService, private datePipe: DatePipe) {}
  ngOnInit(): void {
    this.newsService.getAllNews().subscribe((noticias) => {
      // Formatear la fecha de cada noticia
      noticias.forEach((noticia) => {
        noticia.fecha = this.datePipe.transform(noticia.fecha, 'dd/MM/yyyy');
      });
      this.noticias = noticias;
    });
  }
}
