package game.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import game.service.MapService;
import game.model.Map;

import java.util.Optional;

public class TestMapController {

    @Mock
    private MapService mapService;

    @InjectMocks
    private MapController mapController;

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
        when(mapService.getAllMaps()).thenReturn(java.util.Arrays.asList(map1, map2)); // Mock du service
        java.util.List<Map> maps = mapController.getAllMaps().getBody(); // Appel du contrôleur
        assertNotNull(maps); // Vérifie que la liste n'est pas nulle
        assertEquals(2, maps.size()); // Vérifie qu'il y a bien 2 maps retournées
        verify(mapService, times(1)).getAllMaps(); // Vérifie que le service a été appelé une fois
    }

    @Test
    void testGetMapById() { // Teste la récupération d'une map par son id
        when(mapService.getMapById(4L)).thenReturn(Optional.of(map1)); // Mock du service

        Map map = mapController.getMapById(4L).getBody(); // Appel du contrôleur

        assertNotNull(map); // Vérifie que la map n'est pas nulle
        assertEquals("Map1", map.getName()); // Vérifie que le nom de la map est correct

        verify(mapService, times(1)).getMapById(4L); // Vérifie que le service a été appelé une fois
    }

    @Test
    void testGetMapByName() { // Teste la récupération d'une map par son nom
        when(mapService.getMapByName("Map2")).thenReturn(Optional.of(map2)); // Mock du service

        Map map = mapController.getMapByName("Map2").getBody(); // Appel du contrôleur

        assertNotNull(map); // Vérifie que la map n'est pas nulle
        assertEquals(5L, map.getId()); // Vérifie que l'id de la map est correct

        verify(mapService, times(1)).getMapByName("Map2"); // Vérifie que le service a été appelé une fois
    }

    @Test
    void testGetMapByIdNotFound() { // Teste le cas où une map n'est pas trouvée par son id
        when(mapService.getMapById(10L)).thenReturn(Optional.empty()); // Mock du service
        var response = mapController.getMapById(10L); // Appel du contrôleur
        assertEquals(404, response.getStatusCodeValue()); // Vérifie que le code de statut est 404
        verify(mapService, times(1)).getMapById(10L); // Vérifie que le service a été appelé une fois
    }

    @Test
    void testGetMapByNameNotFound() { // Teste le cas où une map n'est pas trouvée par son nom
        when(mapService.getMapByName("UnknownMap")).thenReturn(Optional.empty()); // Mock du service
        var response = mapController.getMapByName("UnknownMap"); // Appel du contrôleur
        assertEquals(404, response.getStatusCodeValue()); // Vérifie que le code de statut est 404
        verify(mapService, times(1)).getMapByName("UnknownMap"); // Vérifie que le service a été appelé une fois
    }

    @Test
    void testGetAllMapsException() { // Teste le cas où une exception est levée lors de la récupération de toutes les maps
        when(mapService.getAllMaps()).thenThrow(new RuntimeException("Database error")); // Mock du service
        var response = mapController.getAllMaps(); // Appel du contrôleur
        assertEquals(500, response.getStatusCodeValue()); // Vérifie que le code de statut est 500
        verify(mapService, times(1)).getAllMaps(); // Vérifie que le service a été appelé une fois
    }

    @Test
    void testGetMapByIdException() { // Teste le cas où une exception est levée lors de la récupération d'une map par son id
        when(mapService.getMapById(4L)).thenThrow(new RuntimeException("Database error")); // Mock du service
        var response = mapController.getMapById(4L); // Appel du contrôleur
        assertEquals(500, response.getStatusCodeValue()); // Vérifie que le code de statut est 500
        verify(mapService, times(1)).getMapById(4L); // Vérifie que le service a été appelé une fois
    }

    @Test
    void testGetMapByNameException() { // Teste le cas où une exception est levée lors de la récupération d'une map par son nom
        when(mapService.getMapByName("Map1")).thenThrow(new RuntimeException("Database error")); // Mock du service
        var response = mapController.getMapByName("Map1"); // Appel du contrôleur
        assertEquals(500, response.getStatusCodeValue()); // Vérifie que le code de statut est 500
        verify(mapService, times(1)).getMapByName("Map1"); // Vérifie que le service a été appelé une fois
    }

    @Test
    void testCreateMap() { // Teste la création d'une nouvelle map
        when(mapService.createMap("Map1")).thenReturn(map1); // Mock du service
        var response = mapController.createMap("Map1"); // Appel du contrôleur
        assertEquals(201, response.getStatusCodeValue()); // Vérifie que le code de statut est 201
        Object body = response.getBody(); // Récupère le corps de la réponse
        assertNotNull(body); // Vérifie que le corps n'est pas nul
        Map respMap = (Map) body; // Cast du corps en Map
        assertEquals("Map1", respMap.getName()); // Vérifie que le nom de la map est correct
        verify(mapService, times(1)).createMap("Map1"); // Vérifie que le service a été appelé une fois
    }

    @Test
    void testCreateMapIllegalArgument() { // Teste le cas où une map avec le même nom existe déjà lors de la création
        when(mapService.createMap("Map1")).thenThrow(new IllegalArgumentException("Map name already exists")); // Mock du service
        var response = mapController.createMap("Map1"); // Appel du contrôleur
        assertEquals(400, response.getStatusCodeValue()); // Vérifie que le code de statut est 400
        assertEquals("Map name already exists", response.getBody()); // Vérifie que le message d'erreur est correct
        verify(mapService, times(1)).createMap("Map1"); // Vérifie que le service a été appelé une fois
    }

    @Test
    void testCreateMapException() { // Teste le cas où une exception est levée lors de la création d'une nouvelle map
        when(mapService.createMap("Map1")).thenThrow(new RuntimeException("Database error")); // Mock du service
        var response = mapController.createMap("Map1"); // Appel du contrôleur
        assertEquals(500, response.getStatusCodeValue()); // Vérifie que le code de statut est 500
        verify(mapService, times(1)).createMap("Map1"); // Vérifie que le service a été appelé une fois
    }

    @Test
    void testRenameMap() { // Teste le renommage d'une map existante
        when(mapService.renameMap(4L, "NewMap")).thenReturn(Optional.of(new Map("NewMap"))); // Mock du service
        var response = mapController.renameMap(4L, "NewMap"); // Appel du contrôleur
        assertEquals(200, response.getStatusCodeValue()); // Vérifie que le code de statut est 200
        Object body = response.getBody(); // Récupère le corps de la réponse
        assertNotNull(body); // Vérifie que le corps n'est pas nul
        Map respMap = (Map) body; // Cast du corps en Map
        assertEquals("NewMap", respMap.getName()); // Vérifie que le nom de la map est correct
        verify(mapService, times(1)).renameMap(4L, "NewMap"); // Vérifie que le service a été appelé une fois
    }

    @Test
    void testRenameMapNotFound() { // Teste le cas où une map n'est pas trouvée lors du renommage
        when(mapService.renameMap(10L, "NewMap")).thenReturn(Optional.empty()); // Mock du service
        var response = mapController.renameMap(10L, "NewMap"); // Appel du contrôleur
        assertEquals(404, response.getStatusCodeValue()); // Vérifie que le code de statut est 404
        verify(mapService, times(1)).renameMap(10L, "NewMap"); // Vérifie que le service a été appelé une fois
    }

    @Test
    void testRenameMapIllegalArgument() { // Teste le cas où une map avec le nouveau nom existe déjà lors du renommage
        when(mapService.renameMap(4L, "Map2")).thenThrow(new IllegalArgumentException("Map name already exists")); // Mock du service
        var response = mapController.renameMap(4L, "Map2"); // Appel du contrôleur
        assertEquals(400, response.getStatusCodeValue()); // Vérifie que le code de statut est 400
        assertEquals("Map name already exists", response.getBody());    // Vérifie que le message d'erreur est correct
        verify(mapService, times(1)).renameMap(4L, "Map2"); // Vérifie que le service a été appelé une fois
    }

    @Test
    void testRenameMapException() { // Teste le cas où une exception est levée lors du renommage d'une map
        when(mapService.renameMap(4L, "NewMap")).thenThrow(new RuntimeException("Database error")); // Mock du service
        var response = mapController.renameMap(4L, "NewMap"); // Appel du contrôleur
        assertEquals(500, response.getStatusCodeValue()); // Vérifie que le code de statut est 500
        verify(mapService, times(1)).renameMap(4L, "NewMap"); // Vérifie que le service a été appelé une fois
    }

}