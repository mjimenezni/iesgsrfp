import { Component } from '@angular/core';
import { NewsService } from '../_services/news.service';
import { New } from '../_models/new';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent {
  noticias: New[] | undefined;
  constructor(private newsService: NewsService) {}
  ngOnInit(): void {
    this.newsService.getAllNews().subscribe((noticias) => {
      this.noticias = noticias;
    });
  }
}
