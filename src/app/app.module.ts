import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import * as fromRoot from '../modules/store';
import { MyApp } from './app.component';
import * as fromMovies from '../modules/movies';
import * as fromMovieStore from '../modules/store/movies';
import { AuthRequest } from './../providers'
 
@NgModule({
  declarations: [
    MyApp,
    fromMovies.MoviesContainer,
    fromMovies.movieListComponent,
    fromMovies.MovieListItemComponent,
    fromMovies.MovieDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    StoreModule.provideStore(fromRoot.reducer),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    EffectsModule.run(fromMovieStore.Effects)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    fromMovies.MoviesContainer,
    fromMovies.MovieDetailComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    fromMovieStore.MoviesApi,
    AuthRequest
  ]
})
export class AppModule {}
