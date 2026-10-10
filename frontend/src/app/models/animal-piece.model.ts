import { Map } from './map.model';
import { Position } from './position.model';
import { TileType } from './tile.model';

export enum AnimalType { // Types de pièces animales
  BEAR = 'BEAR',
  FISH = 'FISH',
  FOX = 'FOX'
}

export abstract class AnimalPiece { // Classe abstraite pour les pièces animales
  // Chaque pièce a un type (ours, poisson, renard)
  constructor(public type: AnimalType) {}

  // Retourne le type de la pièce
  public getType(): AnimalType {
    return this.type;
  }

  abstract getIcon(): string; // Pour l'affichage dans l'UI

  abstract calculatePoints(map: Map, position: Position): number; // Calcul des points gagnés en plaçant la pièce à une position donnée

  // Pour calculer le score quand tu hover sur une tuile
  abstract calculateScoreDetails(map: Map, position: Position): { base: number, details: { [key: string]: number } }; // Détails du score (base + détails par case adjacente)
}

export class BearPiece extends AnimalPiece {
  constructor() {
    super(AnimalType.BEAR);
  }

  override getIcon(): string {
      return '/bear.svg'
  }

  calculatePoints(map: Map, position: Position): number {
    // Calcul des points pour l'ours : radius de 2
    // gagne 6 points de base
    // +4 points par case forêt adjacente
    // +7 points par poisson adjacent
    // -2 points par renard adjacent
    // -5 points par ours adjacent
    let points = 6;
    const radius = 2;

    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (!(dx === 0 && dy === 0)){
        
        const tile = map.getTile(new Position(position.x + dx, position.y + dy));
        if (tile) {
          if(tile.piece === null){
              if (tile.type === TileType.FOREST) points += 4;
          }
          if (tile.piece) {
            if (tile.piece.type === AnimalType.FISH) points += 7;
            if (tile.piece.type === AnimalType.FOX) points -= 2;
            if (tile.piece.type === AnimalType.BEAR) points -= 5;
          }
        }
        }
      }
    }
    return points;
  }

  calculateScoreDetails(map: Map, position: Position): { base: number, details: { [key: string]: number } } {
    // Même logique que pour le calcul des points, mais on remplit un objet détails (dictionnaire) avec les points par case adjacente
    const details: { [key: string]: number } = {};
    let basePoints = 6;

    const radius = 2;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (!(dx === 0 && dy === 0)) {
          const adjPosition = new Position(position.x + dx, position.y + dy);
          const tile = map.getTile(adjPosition);
          if (tile) {
            let points = 0;
            if (tile.piece === null) {
              if (tile.type === TileType.FOREST) points = 4;
            } else {
              if (tile.piece.type === AnimalType.FISH) points = 7;
              if (tile.piece.type === AnimalType.FOX) points = -2;
              if (tile.piece.type === AnimalType.BEAR) points = -5;
            }
            if (points !== 0) {
              details[`${adjPosition.x},${adjPosition.y}`] = points;
            }
          }
        }
      }
    }

    return { base: basePoints, details };
  }
}

export class FishPiece extends AnimalPiece {
  constructor() {
    super(AnimalType.FISH);
  }

  override getIcon(): string {
      return '/fish.svg'
  }

  calculatePoints(map: Map, position: Position): number {
    // Calcul des points pour le poisson : radius de 1
    // gagne 8 points de base
    // +5 points par case eau adjacente
    // -2 points par poisson adjacent
    let points = 8;
    const radius = 1;

    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (!(dx === 0 && dy === 0)){
        
        const tile = map.getTile(new Position(position.x + dx, position.y + dy));
        if (tile) {
          if(tile.piece === null){
            if (tile.type === TileType.WATER) points += 5;
          }
          if (tile.piece?.type === AnimalType.FISH) points -= 2;
        }
      }
      }
    }
    return points;
  }

  calculateScoreDetails(map: Map, position: Position): { base: number, details: { [key: string]: number } } {
    // Même logique que pour le calcul des points, mais on remplit un objet détails (dictionnaire) avec les points par case adjacente
    const details: { [key: string]: number } = {};
    let basePoints = 8;

    const radius = 1;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (!(dx === 0 && dy === 0)) {
          const adjPosition = new Position(position.x + dx, position.y + dy);
          const tile = map.getTile(adjPosition);
          if (tile) {
            let points = 0;
            if (tile.piece === null) {
              if (tile.type === TileType.WATER) points = 5;
            } else {
              if (tile.piece?.type === AnimalType.FISH) points = -2;
            }
            if (points !== 0) {
              details[`${adjPosition.x},${adjPosition.y}`] = points;
            }
          }
        }
      }
    }

    return { base: basePoints, details };
  }
}

export class FoxPiece extends AnimalPiece {
  constructor() {
    super(AnimalType.FOX);
  }

  override getIcon(): string {
      return '/fox.svg'
  }

  calculatePoints(map: Map, position: Position): number {
    // Calcul des points pour le poisson : radius de 1
    // gagne 5 points de base
    // +7 points par case plaine adjacente
    // -2 points par renard adjacent
    let points = 5;
    const radius = 1;

    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (!(dx === 0 && dy === 0)){
        
        const tile = map.getTile(new Position(position.x + dx, position.y + dy));
        if (tile) {
          if(tile.piece === null){
            if (tile.type === TileType.PLAIN) points += 7;
          }
          if (tile.piece?.type === AnimalType.FOX) points -= 2;
        }
      }
    }
    }
    return points;
  }

  calculateScoreDetails(map: Map, position: Position): { base: number, details: { [key: string]: number } } {
    // Même logique que pour le calcul des points, mais on remplit un objet détails (dictionnaire) avec les points par case adjacente
    const details: { [key: string]: number } = {};
    let basePoints = 5;

    const radius = 1;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        if (!(dx === 0 && dy === 0)) {
          const adjPosition = new Position(position.x + dx, position.y + dy);
          const tile = map.getTile(adjPosition);
          if (tile) {
            let points = 0;
            if (tile.piece === null) {
              if (tile.type === TileType.PLAIN) points = 7;
            } else {
              if (tile.piece?.type === AnimalType.FOX) points = -2;
            }
            if (points !== 0) {
              details[`${adjPosition.x},${adjPosition.y}`] = points;
            }
          }
        }
      }
    }

    return { base: basePoints, details };
  }
}

