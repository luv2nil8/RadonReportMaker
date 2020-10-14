import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { User } from '../models/user';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  user: User;
  constructor(
    private storage: NativeStorage,
    private env: EnvService,
    private http: HTTP,

  ) {}

  async login(user: User): Promise<boolean> {

    const headers = this.http.getBasicAuthHeader(user.key, user.secret);
    try {
      const response = await this.http.get(this.env.API_URL + '/orders/footprints', {} , headers);
      console.table(JSON.parse(response.data));
      if (JSON.parse(response.data).status === 'ok'){
        await this.storage.setItem('user', user);
        this.loggedIn = true;
        this.user = user;
        return Promise.resolve(true);
      } else {
        this.loggedIn = false;
        delete this.user;
        return Promise.resolve(false);
      }

    } catch (error){
      this.loggedIn = true;
      delete this.user;
      console.error('error');
      return Promise.resolve(false);
    }
  }

  async checkCredentials(): Promise<boolean> {
    try {
      const user = await this.storage.getItem('user');
      console.log('User: ' + JSON.stringify(user));
      console.log('Creds: ' + await this.login(user));
      return Promise.resolve( await this.login(user));
    } catch (error) {
      console.log('GetToken: Error: ' + error);
      return Promise.resolve(false);
    }
  }

  logout(){
    this.storage.remove('user');
    delete this.user;
    this.loggedIn = false;
  }
}
