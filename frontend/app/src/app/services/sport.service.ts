import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SportService {

  constructor(private http: HttpClient) { }

  uri='http://localhost:4000/sports';

  getAllSports () {

    return this.http.get(`${this.uri}/getAllSports`);
    
  }

  getAllTeamSports () {

    return this.http.get(`${this.uri}/getAllTeamSports`);

  }

  getAllSportsInOlympics () {

    return this.http.get(`${this.uri}/getAllSportsInOlympics`);
    
  }

  getAllTeamSportsInOlympics () {

    return this.http.get(`${this.uri}/getAllTeamSportsInOlympics`);

  }

  getAllSportsNotInOlympics () {

    return this.http.get(`${this.uri}/getAllSportsNotInOlympics`);
    
  }

  getAllTeamSportsNotInOlympics () {

    return this.http.get(`${this.uri}/getAllTeamSportsNotInOlympics`);

  }

  addToOlympics (sport: string, discipline: string) {

    const data = {
      sport: sport,
      discipline: discipline
    }

    return this.http.post(`${this.uri}/addToOlympics`, data);

  }

}
