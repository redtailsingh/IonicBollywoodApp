import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Movie } from './../../store/movies/models';
import    { MovieDetailComponent } from './detail.component';

@Component({
  selector: 'movie-list-item',
  template: `
      <ion-card>
        <img (click)="onClick()" [src]="movie.Poster"/>
        <ion-card-content>
          <p>
            {{ movie.Plot }}
          </p>
        </ion-card-content>
      </ion-card>
  `
})
/*     <ion-card>
      <img (click)="onClick()" [src]="movie.Poster"/>
      <ion-card-content>
        <ion-card-title>
          {{ movie.Title }}
        </ion-card-title>
        <p>
          {{ movie.Plot }}
        </p>
    </ion-card-content>
    </ion-card> */
export class MovieListItemComponent {
  @Input() movie: Movie;

  constructor(public navCtrl: NavController) {

  }
  onClick() {
    this.navCtrl.push(MovieDetailComponent, {
      movie: this.movie
    });
  }
}
