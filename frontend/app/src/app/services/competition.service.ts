import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompetitionService {

  constructor(private http:HttpClient) { }

  uri='http://localhost:4000/competitions';

  startCompetitionByOrganizer (sport: string, discipline: string, category: string, gender: string, format: string, allowedResults: string[], phases: string, rounds: number,
                                startDate: string, endDate: string, locations: string[], delegates: string[], participants: string[], teams: string[]) {
    
    const data = {
      sport: sport,
      discipline: discipline,
      category: category,
      gender: gender,
      format: format,
      allowedResults: allowedResults,
      phases: phases,
      rounds: rounds,
      startDate: startDate,
      endDate: endDate,
      locations: locations,
      delegates: delegates,
      participants: participants,
      teams: teams
    }

    console.log (data);

    return this.http.post(`${this.uri}/startCompetitionByOrganizer`, data);
  
  }

}
