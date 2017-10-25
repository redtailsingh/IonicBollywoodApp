import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { normalize } from "normalizr";

import { NormalizedResponse } from './../../core';
import { AuthRequest } from '../../../providers';
import * as schema from './schema';

@Injectable()
export class MoviesApi {

  constructor(private authRequest: AuthRequest) {}

  fetch(): Observable<NormalizedResponse> {
    console.log('fetch() is called')
    return this.authRequest
      .get('/')
      .map(response => normalize(response.json(), schema.movies))
  }
}
