import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  uri='http://localhost:4000/users';

  login (username: string, password: string) {

    const data = {
      username: username,
      password: password
    }

    return this.http.post(`${this.uri}/login`, data);

  }

  register (username: string, password: string, mail: string, firstname: string, lastname: string, country: string, type: string) {

    const data = {
      username: username,
      password: password,
      mail: mail,
      firstname: firstname,
      lastname: lastname,
      country: country,
      type: type
    }

    return this.http.post(`${this.uri}/register`, data);
  
  }

  changePassword (username: string, oldPassword: string, newPassword: string) {

    const data = {
      username: username,
      oldPassword: oldPassword,
      newPassword: newPassword
    }

    return this.http.post(`${this.uri}/changePassword`, data);

  }

  pendingRequests () {

    return this.http.get(`${this.uri}/pendingRequests`);

  }

  approveRequest (username: string) {

    const data = {
      username: username
    }

    return this.http.post(`${this.uri}/approveRequest`, data);

  }

  rejectRequest (username: string) {

    const data = {
      username: username
    }

    return this.http.post(`${this.uri}/rejectRequest`, data);

  }

  getAvailableDelegates () {

    return this.http.get(`${this.uri}/getAvailableDelegates`);

  }

}
