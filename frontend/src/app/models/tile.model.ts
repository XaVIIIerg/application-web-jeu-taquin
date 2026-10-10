import { Position } from './position.model';
import { AnimalPiece, AnimalType } from './animal-piece.model';

export enum TileType { // Types de tuiles
  PLAIN = 'PLAIN',
  WATER = 'WATER',
  FOREST = 'FOREST'
}

export class Tile {
  // La pièce placée sur la tuile, null si aucune
  public piece: AnimalPiece | null = null;

  constructor(
    public position: Position,
    public type: TileType
  ) { }

  // Créer une Tile à partir d'un objet JSON
  static fromJson(json: any): Tile {
    if (!json) return new Tile(new Position(0, 0), TileType.PLAIN); // Tuile par défaut si JSON invalide (ça ne devrait pas arriver)

    const position = new Position(json.position?.x || 0, json.position?.y || 0); // Position par défaut si invalide (ça ne devrait pas arriver)
    const type = json.type as TileType || TileType.PLAIN; // Type par défaut si invalide (ça ne devrait pas arriver)

    const tile = new Tile(position, type); // Créer la tuile
    // On ne convertit pas la pièce ici car elle sera gérée par le jeu
    return tile;
  }

  // Pour placer une pièce sur la tuile
  setPiece(piece: AnimalPiece): boolean {
    if (this.canAccept(piece)) { // Vérifier si la tuile peut accepter la pièce
      this.piece = piece;
      return true;
    }
    return false;
  }

  // Vérifier si la tuile est vide
  isEmpty(): boolean {
    return this.piece === null;
  }

  // Vérifier si la tuile peut accepter une pièce donnée
  canAccept(piece: AnimalPiece): boolean {
    // Si une tuile est déjà occupée par une pièce ou si le type de la pièce et celle de la tuile ne correspondent pas, on ne peut pas accepter la pièce
    if (!this.isEmpty()) return false;

    if (this.type === TileType.WATER) { // Seules les pièces de type poisson peuvent être placées sur l'eau
      return piece.getType() === AnimalType.FISH;
    } else { // Les autres types de tuiles n'acceptent pas les poissons
      return piece.getType() !== AnimalType.FISH;
    }
  }

  // Vérifier si la tuile peut accepter une pièce d'un certain type
  canAcceptType(pieceType: AnimalType): boolean {
    // Est-ce que la tuile peut accepter une pièce de ce type
    if (!this.isEmpty()) return false;

    if (this.type === TileType.WATER) { // Seules les pièces de type poisson peuvent être placées sur l'eau
      return pieceType === AnimalType.FISH;
    } else { // Les autres types de tuiles n'acceptent pas les poissons
      return pieceType !== AnimalType.FISH;
    }
  }

  getTerrainImage(): string {
    // Pour accéder à l'image du terrain
    switch (this.type) {
      case TileType.FOREST:
        return '/tree.svg';
      case TileType.WATER:
        return '/water.svg';
      case TileType.PLAIN:
        return '/plain.svg';
      default:
        return '/plain.svg';
    }
  }

  // Pour accéder à l'image de la pièce sur la tuile
  getPieceImage(): string {
    return this.piece ? this.piece.getIcon() : '';
  }
}
