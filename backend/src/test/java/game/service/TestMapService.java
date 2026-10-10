package game.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import game.model.Map;
import game.repository.MapRepository;

public class TestMapService {

    @Mock
    private MapRepository repository;

    @InjectMocks
    private MapService mapService;

    Map map1;
    Map map2;

    @BeforeEach
    void setUp() { // Initialise les mocks et les objets de test avant chaque test
        MockitoAnnotations.openMocks(this);
        map1 = new Map("Map1");
        map1.setId(4L);
        map2 = new Map("Map2");
        map2.setId(5L);
    }

    @Test
    void testGetAllMaps() { // Teste la récupération de toutes les maps
        when(repository.findAll()).thenReturn(java.util.Arrays.asList(map1, map2)); // Mock du repository
        java.util.List<Map> maps = mapService.getAllMaps(); // Appel du service
        assertEquals(2, maps.size()); // Vérifie qu'il y a bien 2 maps retournées
        verify(repository, times(1)).findAll(); // Vérifie que le repository a été appelé une fois
    }

    @Test
    void testGetMapById() { // Teste la récupération d'une map par son id
        when(repository.findById(4L)).thenReturn(java.util.Optional.of(map1)); // Mock du repository
        java.util.Optional<Map> mapOpt = mapService.getMapById(4L); // Appel du service
        assertTrue(mapOpt.isPresent()); // Vérifie que la map est présente
        assertEquals("Map1", mapOpt.get().getName()); // Vérifie que le nom de la map est correct
        verify(repository, times(1)).findById(4L); // Vérifie que le repository a été appelé une fois
    }

    @Test
    void testGetMapById_NullId() { // Teste le cas où l'id est null
        Exception exception = assertThrows(IllegalArgumentException.class, () -> { // Vérifie qu'une exception est levée
            mapService.getMapById(null);
        });
        assertEquals("L'id ne peut pas être null.", exception.getMessage()); // Vérifie le message de l'exception
        verify(repository, never()).findById(anyLong()); // Vérifie que le repository n'a jamais été appelé
    }

    @Test
    void testGetMapByName() { // Teste la récupération d'une map par son nom
        when(repository.findByName("Map2")).thenReturn(java.util.Optional.of(map2)); // Mock du repository
        java.util.Optional<Map> mapOpt = mapService.getMapByName("Map2"); // Appel du service
        assertTrue(mapOpt.isPresent()); // Vérifie que la map est présente
        assertEquals(5L, mapOpt.get().getId()); // Vérifie que l'id de la map est correct
        verify(repository, times(1)).findByName("Map2"); // Vérifie que le repository a été appelé une fois
    }

    @SuppressWarnings("null")
    @Test
    void testCreateMap() { // Teste la création d'une nouvelle map
        when(repository.existsByName("Map1")).thenReturn(false); // Mock du repository
        when(repository.save(any(Map.class))).thenReturn(map1); // Mock de la sauvegarde

        Map createdMap = mapService.createMap("Map1"); // Appel du service

        assertNotNull(createdMap); // Vérifie que la map créée n'est pas nulle
        assertEquals("Map1", createdMap.getName()); // Vérifie que le nom de la map est correct
        verify(repository, times(1)).save(any(Map.class)); // Vérifie que le repository a été appelé une fois pour la sauvegarde
    }

    @SuppressWarnings("null")
    @Test
    void testCreateMap_DuplicateName() { // Teste le cas où une map avec le même nom existe déjà
        when(repository.existsByName("Map1")).thenReturn(true); // Mock du repository

        Exception exception = assertThrows(IllegalArgumentException.class, () -> { // Vérifie qu'une exception est levée
            mapService.createMap("Map1");
        });

        assertEquals("Une carte avec le nom 'Map1' existe déjà.", exception.getMessage()); // Vérifie le message de l'exception
        verify(repository, never()).save(any(Map.class)); // Vérifie que le repository n'a jamais été appelé pour la sauvegarde
    }

    @Test
    void testRenameMap() { // Teste le renommage d'une map existante
        when(repository.findById(4L)).thenReturn(java.util.Optional.of(map1)); // Mock du repository
        when(repository.existsByName("NewMap")).thenReturn(false); // Mock du repository
        doNothing().when(repository).renameById(4L, "NewMap"); // Mock du renommage
        when(repository.findById(4L)).thenReturn(java.util.Optional.of(new Map("NewMap"))); // Mock de la récupération après renommage

        java.util.Optional<Map> renamedMapOpt = mapService.renameMap(4L, "NewMap"); // Appel du service

        assertTrue(renamedMapOpt.isPresent());  // Vérifie que la map renommée est présente
        assertEquals("NewMap", renamedMapOpt.get().getName());  // Vérifie que le nom de la map est correct
        verify(repository, times(1)).renameById(4L, "NewMap"); // Vérifie que le repository a été appelé une fois pour le renommage
    }

    @Test
    void testRenameMap_DuplicateName() { // Teste le cas où une map avec le nouveau nom existe déjà
        when(repository.findById(4L)).thenReturn(java.util.Optional.of(map1)); // Mock du repository
        when(repository.existsByName("Map2")).thenReturn(true); // Mock du repository

        Exception exception = assertThrows(IllegalArgumentException.class, () -> { // Vérifie qu'une exception est levée
            mapService.renameMap(4L, "Map2");
        });

        assertEquals("Une carte avec le nom 'Map2' existe déjà.", exception.getMessage()); // Vérifie le message de l'exception
        verify(repository, never()).renameById(4L, "Map2"); // Vérifie que le repository n'a jamais été appelé pour le renommage
    }

    @Test
    void testRenameMap_NonExistentId() { // Teste le cas où la map à renommer n'existe pas
        when(repository.findById(999L)).thenReturn(java.util.Optional.empty()); // Mock du repository
        java.util.Optional<Map> renamedMapOpt = mapService.renameMap(999L, "NewMap"); // Appel du service

        assertFalse(renamedMapOpt.isPresent()); // Vérifie que la map renommée n'est pas présente

        verify(repository, never()).renameById(anyLong(), anyString()); // Vérifie que le repository n'a jamais été appelé pour le renommage
    }

    @Test
    void testRenameMap_NullId() { // Teste le cas où l'id est null lors du renommage
        Exception exception = assertThrows(IllegalArgumentException.class, () -> { // Vérifie qu'une exception est levée
            mapService.renameMap(null, "NewMap");
        });
        assertEquals("L'id ne peut pas être null.", exception.getMessage()); // Vérifie le message de l'exception
        verify(repository, never()).renameById(anyLong(), anyString()); // Vérifie que le repository n'a jamais été appelé pour le renommage
    }
}
