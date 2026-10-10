import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Map as GameMap } from '../../models/map.model';
import { Tile } from '../../models/tile.model';
import { Position } from '../../models/position.model';
import { InteractoModule } from 'interacto-angular';
import { AnimalType } from '../../models/animal-piece.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, InteractoModule],
  templateUrl: './map.html',
  styleUrls: ['./map.css']
})
export class MapComponent {
  // J"ai changé le nom du model map pour éviter le conflit avec les maps type dictionnaire : je pensais qu'on allait en utiliser pour avoir les scores affichés sur différentes tuiles
  @Input() map!: GameMap;
  // Pièce sélectionnée pour afficher le score potentiel
  @Input() selectedPieceType: AnimalType | null = null;
  // Fonction pour calculer le score potentiel
  @Input() getScoreDetails!: (position: Position) => { base: number, details: { [key: string]: number } } | null;
  // Permets de réenvoyer des infos à game.ts (si tu sais pas trop ce que ça fait regarde le cours)
  @Output() tileClick = new EventEmitter<Position>();

  // Variable pour savoir si l'animation de départ a été jouée
  private animationPlayed = false;
  // Tuile qu'on survole
  hoveredTile: Tile | null = null;
  // Le score qu'on aurait si on posait la pièce (pour l'affichage)
  scoreDetails: { base: number, details: { [key: string]: number } } | null = null;

  ngOnInit() {
    // Après 2 secondes, on arrête d'animer les tuiles
    setTimeout(() => {
      this.animationPlayed = true;
    }, 1500);
  }

  getTerrainImage(tile: Tile): string {
    // Pour afficher les tiles
    return tile.getTerrainImage();
  }

  getPieceImage(tile: Tile): string {
    // Pour afficher les pièces
    return tile.getPieceImage();
  }

  onTileClick(tile: Tile): void {
    // Réenvoie les infos de la position de la tile à game.ts
    this.tileClick.emit(tile.position);
  }

  shouldAnimateTile(tile: Tile): boolean {
    // Animer seulement les tuiles sans pièces ET seulement au début (normalement on devrait pas avoir de pièces au début)
    return !tile.piece && !this.animationPlayed;
  }

  onTileHover(tile: Tile): void {
    this.hoveredTile = tile;

    // Calculer le score seulement si une pièce est sélectionnée et que la tuile peut l'accepter
    if (this.selectedPieceType && tile.isEmpty() && tile.canAcceptType(this.selectedPieceType)) {
      this.scoreDetails = this.getScoreDetails(tile.position);
    } else {
      this.scoreDetails = null;
    }
  }

  onTileHoverEnd(): void {
    // Quand on arrête de survoler une tuile : on remet tout à null pour ne pas afficher de score
    this.hoveredTile = null;
    this.scoreDetails = null;
  }

  // Obtenir le score pour une tuile spécifique
  getScoreForTile(tile: Tile): number | null {
    if (!this.scoreDetails || !this.hoveredTile) { // Si pas de score à afficher ou pas de tuile survolée on retourne null
      return null;
    }

    const positionKey = `${tile.position.x},${tile.position.y}`; // Clé pour accéder au score dans le détails
    
    // Si c'est la tuile survolée, retourner seulement le score de base
    if (tile === this.hoveredTile) {
      return this.scoreDetails.base;
    }
    
    // Sinon, retourner le score spécifique à cette tuile adjacente
    return this.scoreDetails.details[positionKey] || null; // Retourne null si pas de score pour cette tuile
  }

  shouldShowScore(tile: Tile): boolean {
    // Afficher le score seulement si on a un score à afficher et qu'une pièce est sélectionnée
    const score = this.getScoreForTile(tile);
    return score !== null && score !== 0 &&
      this.selectedPieceType !== null;
  }
}