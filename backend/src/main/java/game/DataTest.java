package game;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import game.model.Map;
import game.repository.MapRepository;

/*DataTest était originalement une classe censé être utiliser pour tester mais vu que je crois qu'on a besoin de map préfaites c'est parfait */
/*pour initialiser des données dans la base de données au démarrage de l'application */
@Component
public class DataTest implements CommandLineRunner {

    @Autowired
    private MapRepository mapRepository;

    @Override
    public void run(String... args) throws Exception {
        // Créer cartes par défaut
        if (mapRepository.count() == 0) {
            mapRepository.save(new Map("Forêt Enchantée"));
            mapRepository.save(new Map("Plaines Sauvages"));
            mapRepository.save(new Map("Lac Mystérieux"));
            
            System.out.println("Cartes par défaut créées !");
        }
    }
}
