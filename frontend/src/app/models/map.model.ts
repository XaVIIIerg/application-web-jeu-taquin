import { Tile } from './tile.model';
import { Position } from './position.model';

export class Map {
  public tiles: Tile[] = [];

  constructor(public name: string = "Carte Par Défaut", tiles?: Tile[]) { // Constructeur de la map
    this.name = name;
    // Si on reçoit des tiles, on les utilise
    if (tiles) {
      this.tiles = tiles;
      return;
    }
  }

  static fromJson(json: any): Map { // Créer une Map à partir d'un objet JSON (utilisé par le service pour récupérer les maps du backend)
    if (!json) return new Map();
    
    // Convertir les tiles JSON en instances de Tile
    const tiles = json.tiles ? json.tiles.map((tileJson: any) => Tile.fromJson(tileJson)) : []; // Si pas de tiles, liste vide (ça ne devrait pas arriver)
    
    return new Map(json.name, tiles);
  }

  hasTileType(type: string): boolean {
    // retourne vrai si la map a des tuiles d'un certain type encore libres où aucune pièce n'est placée
    return this.tiles.some(tile => tile.type === type && tile.isEmpty());
  }

  getTile(position: Position): Tile | null{ // Retourne la tuile à une position donnée ou null si la position est invalide
    if(position.getX() < 0 || position.getX() >= 8 || position.getY() < 0 || position.getY() >= 8){
      return null;
    }
    const index = position.getY() * 8 + position.getX();
    return this.tiles[index];
  }

  isFull(): boolean {
    // Si toutes les tuiles sont occupées alors la carte est pleine et on retourne vrai
    return this.tiles.every(tile => !tile.isEmpty());
  }

  clearAllPieces(){ // Enlever toutes les pièces de la map (pour réinitialiser la partie)
    this.tiles.forEach(tile => {
      tile.piece = null;
    });
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}
