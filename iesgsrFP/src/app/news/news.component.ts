import { Component } from '@angular/core';
import { NewsService } from '../_services/news.service';
import { News } from '../_models/news';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent {
  noticias: News[] | undefined;
  constructor(private newsService: NewsService) {}
  ngOnInit(): void {
    this.newsService.getAllNews().subscribe((noticias) => {
      this.noticias = noticias;
    });
  }
}
