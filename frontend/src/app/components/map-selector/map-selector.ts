import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MapService } from '../../service/map-service';
import { GameService } from '../../service/game-service';
import { Map } from '../../models/map.model';

@Component({
  selector: 'app-map-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './map-selector.html',
  styleUrls: ['./map-selector.css']
})
export class MapSelector implements OnInit {
  // Liste des maps disponibles
  availableMaps: Map[] = [];
  // Nom du joueur
  playerName: string = '';
  // États de chargement et d'erreur
  loading: boolean = false;
  error: string = '';

  constructor(
    private mapService: MapService,
    private gameService: GameService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Récupère les maps depuis le backend
    await this.loadAvailableMaps();
  }
  
  async loadAvailableMaps() { // Fonction pour charger les maps
    this.loading = true; // Indique que le chargement est en cours
    this.error = ''; // Réinitialise l'erreur
    
    try {
      this.availableMaps = await this.mapService.getAvailableMaps().toPromise() || []; // Récupère les maps via le service
    } catch (error) {
      this.error = 'Erreur de chargement des cartes'; // Message d'erreur en cas d'échec (si le bacjkend ne répond pas par exemple (vérifie que tu l'as lancé... j'ai perdu des heures comme ça))
      console.error('Error', error); // Log de l'erreur
    } finally {
      this.loading = false; // Indique que le chargement est terminé
    }
  }

  async selectMap(mapName: string) {
    // Quand on clique sur un bouton on démarre le jeu en utilisant les services
    this.loading = true; // Indique que le chargement est en cours
    this.error = ''; // Réinitialise l'erreur

    try {
      await this.gameService.startNewGame(this.playerName, mapName); // Démarre une nouvelle partie avec le nom du joueur et de la map
      this.router.navigate(['/game']); // Navigue vers l'écran de jeu
    } catch (error) {
      this.error = 'Erreur du démarrage du jeu'; // Message d'erreur en cas d'échec (si le bacjkend ne répond pas par exemple (vérifie que tu l'as lancé... j'ai perdu des heures comme ça))
      console.error('Error:', error); // Log de l'erreur
    } finally {
      this.loading = false; // Indique que le chargement est terminé
    }
  }


  async createRandomMap() {
    // Générer un nom aléatoire (credit to stackoverflow https://stackoverflow.com/questions/1349404/generate-a-string-of-random-characters )
    const length = 8;
    var result           = 'map ';
    const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const mapName = result; // Nom de la map généré
    
    // Crée une nouvelle map via le service
    this.loading = true;
    this.error = '';

    try {
      const newMap = await this.gameService.createRandomMap(mapName); // Crée une nouvelle map via le service
      this.availableMaps.push(newMap); // Ajoute la nouvelle map à la liste des maps disponibles
    } catch (error) {
      this.error = 'Erreur de la création de la carte'; // Même chose qu'au dessus
      console.error('Error', error);
    } finally {
      this.loading = false;
    }
  }

}