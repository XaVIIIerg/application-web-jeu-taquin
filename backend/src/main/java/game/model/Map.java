package game.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Entity
public class Map {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Génére automatiquement les ids
    private Long id;

    private String name;

    @OneToMany(mappedBy = "map", cascade = CascadeType.ALL, orphanRemoval = true) // Une map peut avoir plusieurs tuiles
    private List<Tile> tiles = new ArrayList<>();

    // Constructeurs
    public Map() {
    }

    public Map(String name) {
        this.name = name;
        this.tiles = generateRandomMap();
    }

    // Génère une map aléatoire de 8x8 tuiles en fonction du nom de la map
    public List<Tile> generateRandomMap() {
        List<Tile> generatedTiles = new ArrayList<>();
        Random random = new Random();
        for (int i = 0; i < 64; i++) { // 8x8 = 64 tuiles
            int x = i % 8;
            int y = i / 8;
            TileType type = getRandomTileType(random); // Détermine le type de tuile aléatoireme,t
            Tile tile = new Tile(new Position(x, y), type);
            tile.setMap(this);
            generatedTiles.add(tile); // Ajoute la tuile générée à la liste
        }
        return generatedTiles;
    }

    // Détermine un type de tuile aléatoire en fonction du nom de la map
    private TileType getRandomTileType(Random random) {
        if (this.name == "Forêt Enchantée") {
            double r = random.nextDouble();
            if (r < 0.25)
                return TileType.WATER;
            if (r < 0.725) // #x on augmente les chances d'avoir une tuile foret
                return TileType.FOREST;
            return TileType.PLAIN;
        } else if (this.name == "Plaines Sauvages") {
            double r = random.nextDouble();
            if (r < 0.25)
                return TileType.WATER;
            if (r < 0.5)
                return TileType.FOREST;
            return TileType.PLAIN; // #x on augmente les chances d'avoir une tuile plaine
        } else if (this.name == "Lac Mystérieux") {
            double r = random.nextDouble();
            if (r < 0.5) // #x on augmente les chances d'avoir une tuile eau
                return TileType.WATER;
            if (r < 0.775)
                return TileType.FOREST;
            return TileType.PLAIN;
        } else {
            // Retourne un type de tuile aléatoire
            double r = random.nextDouble();
            if (r < 0.33)
                return TileType.WATER;
            if (r < 0.66)
                return TileType.FOREST;
            return TileType.PLAIN; // #x ici on a la même chance pour chaque type
        }
    }

    // Getters et Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Tile> getTiles() {
        return tiles;
    }

    public void setTiles(List<Tile> tiles) {
        this.tiles = tiles;
        // Chaque tile doit référence cette map
        if (tiles != null) {
            tiles.forEach(tile -> tile.setMap(this));
        }
    }

    @Override
    public String toString() {
        return "Map{" + "id=" + id + ", name='" + name + '\'' + ", tilesCount=" + (tiles != null ? tiles.size() : 0)
                + '}';
    }
}
