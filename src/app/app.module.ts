import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {FormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

// Import the Http Module and our Data Service
import { HttpModule } from '@angular/http';
import { DataService } from './data.service';
import { AlarmsComponent } from './components/alarms/alarms.component';
import { MusicComponent } from './components/music/music.component';
import { SettingsComponent } from './components/settings/settings.component';
import { appRoutes } from './routerConfig';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    AlarmsComponent,
    MusicComponent,
    SettingsComponent,
    HomeComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    HttpModule,              // <-Add HttpModule
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports:  [
    RouterModule
  ],
  providers: [DataService], // <-Add DataService
  bootstrap: [AppComponent]
})
export class AppModule { }
