import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ){}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise< boolean | UrlTree > {
    const nav = await this.auth.checkCredentials();
    if (nav) { // this is working, checkCredentials or its deps is the problem.

      return true;
    } else {
      return this.router.parseUrl('login'); }
  }
}
