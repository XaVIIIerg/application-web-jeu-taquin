import { Map } from './map.model';
import { AnimalPiece, BearPiece, FishPiece, FoxPiece, AnimalType } from './animal-piece.model';
import { Position } from './position.model';

export class Game {
  // État du jeu de départ : tour 1, score 0, niveau de score suivant 8, nom du joueur, carte, pièces disponibles (un ours au départ)
  public currentTurn: number = 1;
  public currentScore: number = 0;
  // On commence à 8 points pour passer au tour 2
  public nextScoreLevel: number = 8;
  public player: string;
  public map: Map;
  public availablePieces: AnimalPiece[] = [];
  // Liste des pièces placées avec leur position et le tour où elles ont été placées
  public placedPieces: { piece: AnimalPiece; position: Position; turnPlaced: number }[] = [];

  constructor(playerName: string, map: Map) {
    // Si pas de nom, générer un nom aléatoire
    this.player = playerName || this.generateRandomName();
    this.map = map;
    // Initialiser les pièces disponibles
    this.initializeGame();
  }

  private initializeGame(): void {
    // Commencer avec un ours
    this.availablePieces.push(new BearPiece());
  }

  private generateRandomName(): string {
    // Générer un nom aléatoire (credit to stackoverflow https://stackoverflow.com/questions/1349404/generate-a-string-of-random-characters )
    const length = 8;
    var result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result; // Nom généré
  }

  private addTurnPieces(): void {
    // Ajouter une pièce de chaque type à chaque tour
    this.availablePieces.push(new BearPiece());
    this.availablePieces.push(new FishPiece());
    this.availablePieces.push(new FoxPiece());
  }

  placePiece(piece: AnimalPiece, position: Position): boolean {
    // La boucle de placement de pièce ! (il faudrait vérifier ce qu'elle retourne afin d'empêcher de placer une pièce si false...)
    const tile = this.map.getTile(position);

    if (!tile || !tile.isEmpty() || !tile.canAccept(piece)) {
      return false;
    }

    // Vérifier si la pièce est disponible
    const pieceIndex = this.availablePieces.findIndex(p => p.getType() === piece.getType()); // vu que maintenant on veut juste enlever une pièce random du même type on cherche juste la première pièce du même type.
    if (pieceIndex === -1) {
      return false;
    }

    // Placer la pièce
    tile.setPiece(piece);

    // Calculer le score
    const score = this.calculateScore(piece, position);
    this.currentScore += score;

    // Ajouter aux pièces placées
    this.placedPieces.push({
      piece,
      position,
      turnPlaced: this.currentTurn
    });

    // Retirer de disponibles
    this.availablePieces.splice(pieceIndex, 1);

    // Vérifier si on passe au tour suivant et aux tours d'après
    while (this.currentScore >= this.nextScoreLevel) {
      this.nextTurn();
    }

    return true;
  }

  calculateScore(piece: AnimalPiece, position: Position): number {
    // Calculer le score pour une pièce placée à une position donnée
    return piece.calculatePoints(this.map, position);
  }

  nextTurn(): void {
    // Passer au tour suivant : on augmente le score et on ajoute des pièces
    this.currentTurn++;
    this.nextScoreLevel += 8 * this.currentTurn;
    this.addTurnPieces();
  }

  isGameOver(): boolean {
    // Le jeu se termine si la carte est pleine ou pas de pièces disponibles ou qu'on ait que des poissons et pas de tuiles d'eau disponibles ou qu'on ait que des ours ou des renards et pas de tuiles forêts ou plaines disponibles
    return this.map.isFull() ||
      this.availablePieces.length === 0 ||
      (this.availablePieces.every(p => p.getType() === AnimalType.FISH) && !this.map.hasTileType('WATER')) ||
      (this.availablePieces.every(p => p.getType() === AnimalType.BEAR) && (!this.map.hasTileType('FOREST') && !this.map.hasTileType('PLAIN'))) ||
      (this.availablePieces.every(p => p.getType() === AnimalType.FOX) && (!this.map.hasTileType('FOREST') && !this.map.hasTileType('PLAIN'))) ||
      (this.availablePieces.some(p => p.getType() === AnimalType.BEAR) && this.availablePieces.some(p => p.getType() === AnimalType.FOX) && !this.availablePieces.some(p => p.getType() === AnimalType.FISH) && (!this.map.hasTileType('FOREST') && !this.map.hasTileType('PLAIN')));
  }

  // Vider les pièces placées (pour réinitialiser la partie)
  emptyPlacedPiece() {
    this.placedPieces = [];
    this.map.clearAllPieces();
  }
  
  setName(name: string): void {
    this.player = name;
  }

  getName(): string {
    return this.player;
  }

  getScoreValue(): number {
    return this.currentScore;
  }
}
