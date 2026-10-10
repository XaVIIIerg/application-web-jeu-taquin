import { UndoableCommand } from 'interacto';
import { AnimalPiece, AnimalType, BearPiece, FishPiece, FoxPiece } from '../models/animal-piece.model';
import { Position } from '../models/position.model';
import { Game } from '../models/game.model';

export class PlacePiece extends UndoableCommand {
    // État avant la commande
    private previousScore: number | null = null;
    private previousTurn: number | null = null;
    private previousNextScoreLevel: number | null = null;
    private previousAvailablePieces: AnimalPiece[] = [];

    // Informations sur le placement
    constructor(
        private game: Game,
        private pieceType: AnimalType,
        private position: Position,
    ) {
        super();
    }

    protected execution(): void {
        // Sauvegarder l'état avant
        this.previousScore = this.game.currentScore;
        this.previousTurn = this.game.currentTurn;
        this.previousNextScoreLevel = this.game.nextScoreLevel;
        this.previousAvailablePieces = [...this.game.availablePieces];
        // Créer la pièce à placer
        let piece: AnimalPiece;

        switch (this.pieceType) { // Créer la pièce en fonction du type
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
                return;
        }

        // Exécuter le placement
        this.game.placePiece(piece, this.position);
    }

    undo(): void {
        // Annuler le placement
        const tile = this.game.map.getTile(this.position); // Récupérer la tuile où la pièce a été placée
        if (tile) {
            tile.piece = null; // Retirer la pièce de la tuile
        }

        // Restaurer l'état du jeu
        if (this.previousScore !== null && this.previousTurn !== null && this.previousNextScoreLevel !== null) {
            this.game.currentScore = this.previousScore;
            this.game.currentTurn = this.previousTurn;
            this.game.nextScoreLevel = this.previousNextScoreLevel;
            this.game.availablePieces = [...this.previousAvailablePieces];
        }

        // Retirer la pièce des pièces placées
        const placedIndex = this.game.placedPieces.findIndex( // Trouver l'index de la pièce placée à cette position
            pp => pp.position.getX() === this.position.getX() &&
                pp.position.getY() === this.position.getY()
        );
        if (placedIndex > -1) {
            this.game.placedPieces.splice(placedIndex, 1); // Retirer la pièce placée de la liste
        }
    }

    redo(): void {
        // Refaire le placement
        this.execution();
    }

    // La commande peut être exécutée si on a une pièce sélectionnée et un jeu actif
    override canExecute(): boolean {
        return this.game !== null && this.pieceType !== null && this.position !== null;
    }
}