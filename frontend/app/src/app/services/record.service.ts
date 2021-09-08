import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(private http:HttpClient) { }

  uri='http://localhost:4000/records';

  getAllRecords () {

    return this.http.get(`${this.uri}/getAllRecords`);
    
  }

}
