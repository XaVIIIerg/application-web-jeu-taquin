package game.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import game.model.Map;

import java.util.List;
import java.util.Optional;

@Repository
public interface MapRepository extends CrudRepository<Map, Long> { // on étend CrudRepository pour les opérations CRUD de base (cf tp de web de 3A)
    Optional<Map> findByName(String name); // Trouve une map par son nom

    @NonNull
    Optional<Map> findById(@NonNull Long id); // Trouve une map par son id
    
    @NonNull
    List<Map> findAll(); // Trouve toutes les maps

    @Modifying
    @Query("UPDATE Map m SET m.name = :name WHERE m.id = :id")
    void renameById(@Param("id") Long id, @Param("name") String name); // Renomme une map par son id
    
    boolean existsByName(String name); // Vérifie si une map existe déjà par son nom
}
