import { Component, OnInit } from '@angular/core';
import { New } from 'src/app/_models/new';
import { NewsService } from 'src/app/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-news-create',
  templateUrl: './news-create.component.html',
  styleUrls: ['./news-create.component.css'],
})
export class NewsCreateComponent {
  newsForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private newsService: NewsService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this.newsForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      fecha: [
        this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        Validators.required,
      ],
      imagen: [''],
    });
  }
  get f() {
    return this.newsForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.newsForm.invalid) {
      return;
    }

    const news: New = {
      titulo: this.f.titulo.value,
      fecha: this.f.fecha.value,
      contenido: this.f.contenido.value,
      imagen: this.f.imagen.value,
    };

    this.newsService.createNews(news).subscribe(() => {
      this.router.navigate(['/admin/news']);
    });
  }
}
