import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewsService } from 'src/app/_services';
import { New } from 'src/app/_models/new';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.css'],
})
export class NewsDetailComponent {
  newsForm!: FormGroup;
  submitted = false;
  id: number | undefined;
  noticia: New = new New();
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private newsService: NewsService,
    private datePipe: DatePipe
  ) {
    this.newsForm = this.formBuilder.group({
      titulo: ['', Validators.required],
      contenido: ['', Validators.required],
      fecha: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      imagen: [''],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    //muestra los valores actuales en el formulario
    this.newsService.getNewsById(id).subscribe((data: New) => {
      this.noticia = data;
      this.newsForm.patchValue({
        titulo: this.noticia.titulo,
        fecha: this.datePipe.transform(this.noticia.fecha, 'yyyy-MM-dd'),
        contenido: this.noticia.contenido,
      });
    });

    this.newsService.getNewsById(id).subscribe(
      (noticia) => {
        this.noticia = noticia;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  get f() {
    return this.newsForm.controls;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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

    if (this.noticia.idnoticia !== undefined) {
      this.newsService
        .updateNews(this.noticia.idnoticia, news, this.selectedFile)
        .subscribe(() => {
          // success message
          this.router.navigate(['/admin/news']);
        });
    }
  }

  onCancel() {
    this.router.navigate(['/admin/news']);
  }
}
