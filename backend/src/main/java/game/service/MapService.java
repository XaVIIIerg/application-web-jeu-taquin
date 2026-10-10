package game.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import game.model.Map;
import game.repository.MapRepository;

@Service
public class MapService {
    @Autowired
    private final MapRepository mapRepository; // Injection du repository

    public MapService(MapRepository mapRepository) {
        this.mapRepository = mapRepository;
    }

    public List<Map> getAllMaps() { // Récupère toutes les maps
        return mapRepository.findAll();
    }

    public Optional<Map> getMapById(Long id) { // Récupère une map par son id
        if (id == null) {
            throw new IllegalArgumentException("L'id ne peut pas être null.");
        }
        return mapRepository.findById(id); // Recherche de la map par id
    }

    public Optional<Map> getMapByName(String name) { // Récupère une map par son nom
        return mapRepository.findByName(name);
    }

    public Map createMap(String name) { // Crée une nouvelle map
        if (mapRepository.existsByName(name)) {
            throw new IllegalArgumentException("Une carte avec le nom '" + name + "' existe déjà.");
        }

        Map newMap = new Map(name);
        return mapRepository.save(newMap); // Sauvegarde de la nouvelle carte : important sinon bug
    }

    @Transactional
    public Optional<Map> renameMap(Long id, String newName) { // Renomme une map existante
        if (id == null) {
            throw new IllegalArgumentException("L'id ne peut pas être null.");
        }
        Optional<Map> existingMap = mapRepository.findById(id); // Vérifie si la map existe
        if (existingMap.isPresent()) {
            if (mapRepository.existsByName(newName)) { // Vérifie si le nouveau nom existe déjà
                throw new IllegalArgumentException("Une carte avec le nom '" + newName + "' existe déjà.");
            }

            mapRepository.renameById(id, newName); // Renomme la map
            // Renvoie la carte mise à jour
            return mapRepository.findById(id);
        }
        return Optional.empty();
    }
}
