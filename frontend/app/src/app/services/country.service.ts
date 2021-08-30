import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http:HttpClient) { }

  uri='http://localhost:4000/countries';

  getAllCountries () {

    return this.http.get(`${this.uri}/getAllCountries`);
    
  }

  getCountryByAbbr (country: string) {

    const data = {
      country: country
    }

    return this.http.post(`${this.uri}/getCountryByAbbr`, data);
  }
}
