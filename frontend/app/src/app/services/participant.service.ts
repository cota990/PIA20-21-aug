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
}
