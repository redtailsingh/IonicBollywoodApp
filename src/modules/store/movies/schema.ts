import { schema } from 'normalizr';

const movieEntity = new schema.Entity('movies');

export const movies = new schema.Object({
  movies: new schema.Array(movieEntity)
})
