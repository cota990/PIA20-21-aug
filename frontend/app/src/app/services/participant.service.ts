import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  constructor(private http: HttpClient) { }

  uri='http://localhost:4000/participants';

  getAllParticipantsForCountry (country: string) {

    const data = {
      country: country
    }

    return this.http.post(`${this.uri}/getAllParticipantsForCountry`, data);
    
  }

  submitParticipant (firstname: string, lastname: string, gender: string, sport: string, disciplines: string[], country: string) {

    const data = {
      firstname: firstname,
      lastname: lastname,
      gender: gender,
      sport: sport,
      disciplines: disciplines,
      country: country
    }

    return this.http.post(`${this.uri}/submitParticipant`, data);
  }
}
