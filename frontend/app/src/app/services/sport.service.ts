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

}
