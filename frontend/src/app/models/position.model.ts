export class Position {
  constructor(
    public x: number,
    public y: number
  ) {}

  // Créer une Position à partir d'un objet JSON
  static fromJson(json: any): Position {
    if (!json) return new Position(0, 0);
    return new Position(json.x || 0, json.y || 0); // Si x ou y n'existe pas, on met 0 par défaut (ça ne devrait pas arriver)
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }
}
