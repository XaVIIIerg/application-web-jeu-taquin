package game.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import game.model.Map;
import game.service.MapService;

@RestController
@RequestMapping("/api/maps")
public class MapController {
    @Autowired
    private final MapService mapService;
    
    public MapController(MapService mapService) {
        this.mapService = mapService;
    }
    // récupère toutes les maps disponibles
    @GetMapping
    public ResponseEntity<List<Map>> getAllMaps() {
        try {
            List<Map> maps = mapService.getAllMaps(); // Appel du service
            return ResponseEntity.ok(maps); // Renvoie la liste des maps avec le statut 200 OK
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // En cas d'erreur, renvoie le statut 500
        }
    }
    // récupère une map depuis son id
    @GetMapping("/{id}")
    public ResponseEntity<Map> getMapById(@PathVariable Long id) {
        try {
            Optional<Map> map = mapService.getMapById(id); // Appel du service
            return map.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build()); // Renvoie la map si trouvée, sinon 404 Not Found
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // En cas d'erreur, renvoie le statut 500
        }
    }
    // récupère une map depuis son nom
    @GetMapping("/name/{name}")
    public ResponseEntity<Map> getMapByName(@PathVariable String name) {
        try {
            Optional<Map> map = mapService.getMapByName(name); // Appel du service
            return map.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build()); // Renvoie la map si trouvée, sinon 404 Not Found
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // En cas d'erreur, renvoie le statut 500
        }
    }
    // crée une map depuis un nom
    @PostMapping
    public ResponseEntity<?> createMap(@RequestParam String name) {
        try {
            Map newMap = mapService.createMap(name); // Appel du service
            return ResponseEntity.status(HttpStatus.CREATED).body(newMap); // Renvoie la nouvelle map avec le statut 201 Created
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // En cas d'erreur de validation, renvoie le statut 400 Bad Request
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Erreur lors de la création de la carte"); // En cas d'erreur, renvoie le statut 500
        }
    }
    // renomme une map depuis son id par un nom name
    @PutMapping("/{id}/rename")
    public ResponseEntity<?> renameMap(@PathVariable Long id, @RequestParam String name) {
        try {
            Optional<Map> updatedMap = mapService.renameMap(id, name); // Appel du service
            return updatedMap.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build()); // Renvoie la map mise à jour si trouvée, sinon 404 Not Found
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // En cas d'erreur de validation, renvoie le statut 400 Bad Request
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Erreur lors du renommage de la carte"); // En cas d'erreur, renvoie le statut 500
        }
    }
}
