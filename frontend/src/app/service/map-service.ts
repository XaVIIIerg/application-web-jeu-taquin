import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Map } from '../models/map.model';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  // URL de l'API backend pour les maps
  private apiUrl = '/api/maps';
  // On commence avec des cartes prédéfinies (backend les génère aléatoirement au démarrage)
  constructor(private http: HttpClient) {} // Injection de HttpClient pour faire des requêtes HTTP

  // Récupérer la liste des cartes disponibles depuis le backend
  getAvailableMaps(): Observable<Map[]> {
    // httpclient va regarder dans le backend à l'url /api/maps et récupérer la liste des cartes en format json
    // pipe va permettre de transformer la liste de json en liste de Map
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(jsons => jsons.map(json => Map.fromJson(json)))
    );
  }

  // Récupérer une carte par son nom
  getMapByName(name: string): Observable<Map> {
    // Faire une requête GET à l'API avec le nom de la carte
    return this.http.get<any>(`${this.apiUrl}/name/${encodeURIComponent(name)}`).pipe( // encoder le nom pour les caractères spéciaux dans l'URL
      map(json => Map.fromJson(json))
    );
  }

  // Récupérer une carte par son ID
  getMapById(id: number): Observable<Map> {
    // Faire une requête GET à l'API avec l'ID de la carte
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(json => Map.fromJson(json))
    );
  }

  // Créer une nouvelle carte avec un nom donné
  createMap(name: string): Observable<Map> {
    // Faire une requête POST à l'API pour créer une nouvelle carte
    return this.http.post<any>(this.apiUrl, null, {params: { name }}).pipe(
      map(json => Map.fromJson(json))
    );
  }

  // Renommer une carte existante
  renameMap(id: number, name: string): Observable<Map> {
    // Faire une requête PUT à l'API pour renommer la carte
    return this.http.put<any>(`${this.apiUrl}/${id}/rename`, null, {
      params: { name }
    }).pipe(
      map(json => Map.fromJson(json))
    );
  }
}