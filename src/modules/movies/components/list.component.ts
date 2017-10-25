import { Component, Input } from '@angular/core';

import { Movie } from './../../store/movies/models';

@Component({
  selector: 'movie-list',
  template: `
    <movie-list-item
      *ngFor="let movie of movies" [movie]="movie">
    </movie-list-item>
  `
})
export class movieListComponent {
  @Input() movies: Movie[];
}
