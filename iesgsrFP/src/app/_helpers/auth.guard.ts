import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { AccountService } from '../_services/account.service';
import { Observable, combineLatest, map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private router: Router, private accountService: AccountService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return combineLatest([
      this.accountService.isLoggedIn,
      this.accountService.isAdminUser,
    ]).pipe(
      map(([isLoggedIn, isAdmin]) => {
        if (state.url.startsWith('/admin') && (!isLoggedIn || !isAdmin)) {
          // Si el usuario no está logueado o no es un administrador y trata de acceder a /admin,
          // lo redirigimos a la página de inicio
          return this.router.createUrlTree(['/'], {
            queryParams: { returnUrl: state.url },
          });
        } else {
          // En cualquier otro caso, permitimos el acceso
          return true;
        }
      })
    );
  }
}
