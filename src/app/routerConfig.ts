
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AlarmsComponent } from './components/alarms/alarms.component';
import { MusicComponent } from './components/music/music.component';
import { SettingsComponent } from './components/settings/settings.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', 
    component: HomeComponent 
  },
  { path: 'alarms', 
    component: AlarmsComponent 
  },
  {
    path: 'music',
    component: MusicComponent
  },
  { path: 'settings',
    component: SettingsComponent
  }
];
export default appRoutes;
