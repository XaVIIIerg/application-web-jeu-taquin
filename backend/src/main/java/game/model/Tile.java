package game.model;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "tiles")
public class Tile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Génére automatiquement les ids
    private Long id; // ça bug si on l'enlève mais on s'en sert pas vraiment

    @Embedded
    private Position position;

    @Enumerated(EnumType.STRING) // Sauvegarde l'enum en tant que String dans la BDD
    private TileType type;

    @ManyToOne
    @JsonIgnore // Evite une boucle infinie lors de la sérialisation JSON (Map -> Tiles -> Map -> ...) (cf tp de web de 3a)
    private Map map;

    // Constructeurs
    public Tile() {}

    public Tile(Position position, TileType type) {
        this.position = position;
        this.type = type;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Position getPosition() { return position; }
    public void setPosition(Position position) { this.position = position; }
    
    public TileType getType() { return type; }
    public void setType(TileType type) { this.type = type; }
    
    public Map getMap() { return map; }
    public void setMap(Map map) { this.map = map; }

    @Override
    public String toString() {
        return "Tile{" + "id=" + id + ", position=" + position + ", type=" + type + '}';
    }
}
