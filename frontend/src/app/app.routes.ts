import { Routes } from '@angular/router';
import { GameComponent } from '../app/components/game/game'
import { MapSelector } from '../app/components/map-selector/map-selector';

export const routes: Routes = [
  { path: '', component: MapSelector }, // Page de sélection de la carte
  { path: 'game', component: GameComponent }, // Page du jeu
  { path: '**', redirectTo: '' } // Redirection vers la page de sélection pour les autres routes
];