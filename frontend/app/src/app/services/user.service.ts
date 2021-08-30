import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  uri='http://localhost:4000/users';

  login (username, password) {

    const data = {
      username: username,
      password: password
    }

    return this.http.post(`${this.uri}/login`, data);
  }

  register (username, password, passwordConfirmation, mail, firstname, lastname, country, type) {

    const data = {
      username: username,
      password: password,
      passwordConfirmation: passwordConfirmation,
      mail: mail,
      firstname: firstname,
      lastname: lastname,
      country: country,
      type: type
    }

    return this.http.post(`${this.uri}/register`, data);
  }
}
