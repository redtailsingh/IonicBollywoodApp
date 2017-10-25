import * as fromMovies from './movies/reducer';

export interface State {
  movies: fromMovies.State
}

export const reducer = { movies: fromMovies.reducer };
