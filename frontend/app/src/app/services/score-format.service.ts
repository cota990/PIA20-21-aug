import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScoreFormatService {

  constructor(private http: HttpClient) { }

  uri='http://localhost:4000/scoreFormats';

  getAllScoreFormats () {

    return this.http.get(`${this.uri}/getAllScoreFormats`);
    
  }

}
