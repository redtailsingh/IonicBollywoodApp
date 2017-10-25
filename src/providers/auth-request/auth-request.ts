import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

const ENDPOINT = 'http://localhost:8081';

@Injectable()
export class AuthRequest {

  constructor(private http: Http ) {}

  getHeaders() {
    return new Headers({
      'Content-Type': 'application/json'
    });
  }

  get(url, options = {}) {
    console.log('get() is called')
    return this.http.get(`${ENDPOINT}${url}`, options);
  }

}
