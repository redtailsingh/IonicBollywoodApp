import { Effect, Actions } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Action } from './../../core';
import { actions } from './';
import { MoviesApi } from './api';

@Injectable()
export class Effects {
  constructor(
    public actions$: Actions,
    public api: MoviesApi
  ) {}

  @Effect() load$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.LOAD_MOVIES)
    .map(res => new actions.Fetch())
  
  @Effect() fetchall$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.FETCH_MOVIES)
    .flatMap(() => this.api.fetch()
    .map((response)=> new actions.FetchSuccess(response)
    )
  )
}
