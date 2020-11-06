import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  API_URL = 'https://goisn.net/nookandkrannyhomeinspections/rest';
  UPLOAD_URL = 'https://blipfiz.com/api/uploadtoisn';
  constructor() { }
}
