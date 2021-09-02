import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) { }

  uri='http://localhost:4000/teams';

  submitTeam (country: string, gender: string, sport: string, discipline: string) {

    const data = {
      country: country,
      gender: gender,
      sport: sport,
      discipline: discipline
    }

    return this.http.post(`${this.uri}/submitTeam`, data);

  }

  getAllTeamsForTeamDiscipline (sport: string, discipline: string, gender: string) {

    const data = {
      gender: gender,
      sport: sport,
      discipline: discipline
    }

    return this.http.post(`${this.uri}/getAllTeamsForTeamDiscipline`, data);

  }

}
