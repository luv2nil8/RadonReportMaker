import { Credentials } from './../models/credentials';
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn = false;
  credentials: Credentials;
  user: any;
  constructor(
    private storage: NativeStorage,
    private env: EnvService,
    private http: HTTP,

  ) {}
  async getCredentials(): Promise<Credentials> {
    return await this.storage.getItem('credentials');
  }
  async getUser(): Promise<any> {
    return await this.storage.getItem('user');
  }
  async login(credentials: Credentials): Promise<boolean> {

    const headers = this.http.getBasicAuthHeader(credentials.key, credentials.secret);
    try {
      const response = await this.http.get(this.env.API_URL + '/me', {} , headers);
      // console.table(JSON.parse(response.data));
      if (JSON.parse(response.data).status === 'ok'){
        const user = JSON.parse(response.data).me;
        await this.storage.setItem('user', user);
        await this.storage.setItem('credentials', credentials);
        this.loggedIn = true;
        this.credentials = credentials;
        return Promise.resolve(true);
      } else {
        this.loggedIn = false;
        delete this.credentials;
        return Promise.resolve(false);
      }

    } catch (error){
      this.loggedIn = true;
      delete this.credentials;
      console.error('error');
      return Promise.resolve(false);
    }
  }

  async checkCredentials(): Promise<boolean> {
    try {
      const credentials = await this.storage.getItem('credentials');
      // console.log('User: ' + JSON.stringify(user));
      // console.log('Creds: ' + await this.login(user));
      return Promise.resolve( await this.login(credentials));
    } catch (error) {
      console.log('GetToken: Error: ' + error);
      return Promise.resolve(false);
    }
  }

  logout(){
    this.storage.remove('credentials');
    delete this.credentials;
    this.loggedIn = false;
  }
}
