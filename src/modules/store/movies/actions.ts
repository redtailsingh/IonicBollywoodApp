import { Action } from './../../core'

export const ActionTypes = {
  LOAD_MOVIES: '[movies] load',
  FETCH_MOVIES: '[movies] fetch',
  FETCH_SUCCESS: '[movies] fetch_success' 
}

export class Load implements Action {
  type = ActionTypes.LOAD_MOVIES
}

export class Fetch implements Action {
  type = ActionTypes.FETCH_MOVIES
}

export class FetchSuccess implements Action{
  type = ActionTypes.FETCH_SUCCESS

  constructor(public payload: any){
      console.log('FetchSuccess constructor is called')
  }
}


export type Action =
  Load |
  Fetch;
