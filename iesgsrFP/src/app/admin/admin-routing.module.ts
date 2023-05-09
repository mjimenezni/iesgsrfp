import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UsersCreateComponent } from './users/users-create/users-create.component';
import { UsersDetailComponent } from './users/users-detail/users-detail.component';
import { NewsCreateComponent } from './news/news-create/news-create.component';
import { NewsDetailComponent } from './news/news-detail/news-detail.component';
import { NewsListComponent } from './news/news-list/news-list.component';
import { AuthGuard } from '../_helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'news', component: NewsListComponent },
      { path: 'users', component: UsersListComponent },
      { path: 'users/create', component: UsersCreateComponent },
      { path: 'users/:id/edit', component: UsersDetailComponent },
      { path: 'news/create', component: NewsCreateComponent },
      { path: 'news/:id/edit', component: NewsDetailComponent },
      { path: '', component: UsersListComponent },
      { path: '', component: UsersListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
