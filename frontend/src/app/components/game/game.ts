import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameService } from '../../service/game-service';
import { Game } from '../../models/game.model';
import { AnimalPiece, AnimalType, BearPiece, FishPiece, FoxPiece } from '../../models/animal-piece.model';
import { Position } from '../../models/position.model';
import { MapComponent } from '../map/map';
import { InteractoModule } from 'interacto-angular';
import { PartialButtonTypedBinder, UndoHistory } from 'interacto';
import { PlacePiece } from '../../command/placepiece';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MapComponent, InteractoModule, FormsModule],
  templateUrl: './game.html',
  styleUrls: ['./game.css']
})
export class GameComponent implements OnInit {
  game: Game | null = null;
  // La pièce sélectionnée et son type
  selectedPiece: AnimalPiece | null = null;
  selectedPieceType: AnimalType | null = null;
  // permets de savoir si on va à l'écran de fin ou pas
  isGameOver: boolean = false;
  AnimalType = AnimalType;
  // Pour undo/redo
  undoHistory: UndoHistory;
  // Pour éditer le nom du joueur en pleine partie
  isEditingName = false;
  tempPlayerName: string = '';

  constructor(
    private gameService: GameService,
    private router: Router
  ) {
    // Récupérer l'historique undo/redo depuis le service
    this.undoHistory = this.gameService.getUndoHistory();
  }

  ngOnInit() {
    // Récupérer le jeu en cours depuis le service
    this.game = this.gameService.getCurrentGame();
  }

  getPieceCount(type: AnimalType): number {
    // Permets de savoir combien de pièces de chaque type on a afin de savoir si on peut en sélectionner une sur le html et pour l'apparence
    if (!this.game) return 0;
    return this.game.availablePieces.filter(piece => piece.getType() === type).length;
  }

  selectPieceType(type: AnimalType) {
    if (this.selectedPieceType === type) { // Si la piece est déjà celle sélectionnée, on la déselectionne
      this.selectedPieceType = null;
    } else if (this.getPieceCount(type) > 0) { // Ne permet de sélectionner que si on a des pièces de ce type
      this.selectedPieceType = type;
    } else {
      this.selectedPieceType = null;
    }
  }

  get scorePercentage(): number { // Pour le cercle de progression du score en haut à gauche
    if (!this.game || this.game.nextScoreLevel === 0) return 0;
    return Math.min(100, (this.game.currentScore / this.game.nextScoreLevel) * 100);
  }

  // Récupérer le score quand tu hover sur une tuile afin de pouvoir l'afficher
  getScoreDetailsForTile(position: Position): { base: number, details: { [key: string]: number } } | null {
    if (!this.game || !this.selectedPieceType || this.isGameOver) { // Si pas de jeu, pas de pièce sélectionnée ou jeu terminé on retourne null
      return null;
    }

    // Créer une pièce temporaire du type sélectionné
    let piece: AnimalPiece;
    switch (this.selectedPieceType) {
      case AnimalType.BEAR:
        piece = new BearPiece();
        break;
      case AnimalType.FISH:
        piece = new FishPiece();
        break;
      case AnimalType.FOX:
        piece = new FoxPiece();
        break;
      default:
        return null;
    }

    return piece.calculateScoreDetails(this.game.map, position);
  }

  onTileClick(position: Position) {
    // Lorsqu'on clique sur une tile alors qu'on a sélectionné un type et qu'on a plus d'une pièce de ce type, on place une pièce sur la tuile
    // La map est visuellement mise à jour !
    if (this.selectedPieceType && this.game && this.getPieceCount(this.selectedPieceType) > 0 && !this.isGameOver) { // Vérifie qu'on a bien une pièce sélectionnée, un jeu en cours, qu'on a des pièces de ce type et que le jeu n'est pas terminé

      // Va chercher l'index de la pièce à placer
      const pieceIndex = this.game.availablePieces.findIndex(p => p.getType() === this.selectedPieceType);

      if (pieceIndex !== -1) { // Si on a trouvé une pièce de ce type à placer
        // Créer et exécuter la commande
        const command = new PlacePiece(
          this.game,
          this.selectedPieceType!,
          position
        );
        command.execute();

        // Ajouter à l'historique undo/redo
        this.undoHistory.add(command);

        // C'est pour éviter qu'on termine le jeu trop tôt alors qu'on devrait récupérer des tuiles : il existe probablement une meilleure façon de faire ça mais bon...
        (async () => { await new Promise(f => setTimeout(f, 1000)); })();

        // Vérifier si le jeu est terminé après le placement
        this.isGameOver = this.game.isGameOver();

        // Si on n'a plus de pièces de ce type, on désélectionne
        if (this.getPieceCount(this.selectedPieceType) === 0) {
          this.selectedPieceType = null;
        }
      }
    }
  }

  undo() {
    // Annuler le dernier placement
    this.undoHistory.undo();
    if (this.game && this.selectedPieceType) {
      // Si on n'a plus de pièces de ce type, on désélectionne
      if (this.getPieceCount(this.selectedPieceType) === 0) {
        this.selectedPieceType = null;
      }
    }
  }

  redo() {
    // Refaire le dernier placement annulé
    this.undoHistory.redo();
    if (this.game && this.selectedPieceType) {
      // Si on n'a plus de pièces de ce type, on désélectionne
      if (this.getPieceCount(this.selectedPieceType) === 0) {
        this.selectedPieceType = null;
      }
    }
  }

  canUndo(): boolean {
    // Vérifie si on peut undo : pour l'affichage du bouton undo
    return this.undoHistory.getUndo().length > 0;
  }

  canRedo(): boolean {
    // Vérifie si on peut redo : pour l'affichage du bouton redo
    return this.undoHistory.getRedo().length > 0;
  }

  startEditingName() {
    // Commencer à éditer le nom du joueur
    if (this.game && !this.isGameOver) {
      this.tempPlayerName = this.game.player; // Met le nom actuel dans la variable temporaire
      this.isEditingName = true; // Passe en mode édition
    }
  }

  savePlayerName() {
    // Sauvegarder le nouveau nom du joueur
    if (this.game && this.tempPlayerName.trim() !== '') { // Ne pas accepter les noms vides
      this.game.setName(this.tempPlayerName.trim()); // Met à jour le nom dans le jeu
    }
    this.isEditingName = false; // Quitter le mode édition
  }

  cancelEditingName() {
    // Annuler l'édition du nom du joueur
    this.isEditingName = false;
  }


  public binderClickEndGame(binder: PartialButtonTypedBinder): void {
    // Lier le bouton de fin de jeu à la méthode endGame
    binder
      .toProduceAnon(() => this.endGame())
      .bind();
  }

  endGame() {
    // Marquer le jeu comme terminé et vider les pièces et l'hhistorique
    if (this.game) {
      this.game.emptyPlacedPiece();
    }
    this.isGameOver = true;
    this.undoHistory.clear();
  }

  goHome() {
    // On retourne à map-selector/le menu
    this.gameService.endGame();
    this.router.navigate(['/']);
  }
}
