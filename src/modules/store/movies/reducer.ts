import { Movie } from './models';
import { ActionTypes } from './actions';

export interface State {
  ids: number[];
  entities: { [id:number]: Movie }
}

let initialState = {
  ids: [],
  entities: {} 
}

export const reducer = (state: State = initialState, action: any) :State => {
  // console.log(action)
  switch (action.type) {
    case (ActionTypes.FETCH_SUCCESS):
      return Object.assign({}, state, {
        ids: [...action.payload.result.movies],
        entities: action.payload.entities.movies
      })
    default: {
      return state;
    }
  }
}

export const getAll = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getList = (state: State) => {
  return state.ids.map(id => state.entities[id]);
}
