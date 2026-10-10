import { Injectable } from '@angular/core';
import { Game } from '../models/game.model';
import { MapService } from './map-service';
import { Map } from '../models/map.model';
import { UndoHistory } from 'interacto';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  // Partie en cours
  private currentGame: Game | null = null;

  constructor(private mapService: MapService, private undoHistory:UndoHistory) {} // Injection de MapService pour récupérer les cartes depuis le backend

  // Démarrer une nouvelle partie -> retourne une promesse car on doit attendre la réponse du backend
  async startNewGame(playerName: string, mapName: string): Promise<void> {
    // Vider l'historique
    this.undoHistory.clear();
    try {
      // Récupérer la carte depuis le backend
      const map = await this.mapService.getMapByName(mapName).toPromise(); // Récupérer la map par son nom
      if (map) {
        this.currentGame = new Game(playerName, map); // Créer une nouvelle partie avec le nom du joueur et la map récupérée
      } else {
        throw new Error('Carte non trouvée'); // Gérer le cas où la carte n'est pas trouvée
      }
    } catch (error) { // Gérer les erreurs de requête HTTP
      console.error('Erreur lors du chargement de la carte:', error);
      throw error;
    }
  }

  // Récupérer la partie en cours
  getCurrentGame(): Game | null {
    return this.currentGame;
  }

  // Récupérer l'historique undo/redo
  getUndoHistory(): UndoHistory {
    return this.undoHistory;
  }

  // Terminer la partie en cours
  endGame(): void {
    if (this.currentGame) {
      // Vider toutes les pièces du plateau
      this.currentGame.emptyPlacedPiece();
    }
    // Supprimer la partie en cours
    this.currentGame = null;
    // Vider l'historique
    this.undoHistory.clear();
  }

  // Créer une nouvelle carte aléatoire via le backend
  async createRandomMap(mapName: string): Promise<Map> {
    // Crée une nouvelle map via le service
    const map = await this.mapService.createMap(mapName).toPromise();
    if (!map) {
      throw new Error('Erreur lors de la création de la carte');
    }
    return map;
  }
}
