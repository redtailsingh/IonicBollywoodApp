import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: "movie-detail",
  template: `
  <ion-header>
    <button ion-button (click)="onClick()">
      <ion-icon name="arrow-back"></ion-icon>
    </button>
  </ion-header>
  
  <ion-content>
    <ion-list>
      <ion-card>
        <img height="350px" [src]="movie.Poster" />
      </ion-card>
      <ion-card>
        <ion-item>
          <ion-label>Genre:</ion-label>
          <ion-label>{{movie.Genre}}</ion-label>
        </ion-item>
      </ion-card>
      <ion-card>
        <ion-item>
          <ion-label>Studio:</ion-label>
          <ion-label>{{movie.Production}}</ion-label>
        </ion-item>
      </ion-card>
      <ion-card>
        <ion-item>
          <ion-label>Cast:</ion-label>
          <ion-label>{{movie.Actors}}</ion-label>
        </ion-item>
      </ion-card>
    </ion-list>
    </ion-content>
  `
})
export class MovieDetailComponent {
  movie: any;

  constructor(
    public navCtrl: NavController,
    public navParam: NavParams
  ) {
    this.movie = this.navParam.get('movie');
  }

  onClick() {
    this.navCtrl.pop();
  }
}
