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
    console.log('Nav: ' + nav);
    if (nav) { // this is working, checkCredentials or its deps is the problem.
      console.log('Returning True');
      return true;
    } else {
      console.log('Nav to Login');
      return this.router.parseUrl('login'); }
  }
}
