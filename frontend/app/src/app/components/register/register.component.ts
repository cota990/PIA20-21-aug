import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
      this.countries = [{name: 'Serbia', abbr: 'Ser', flag: 'flag'}, {name: 'United States Of America', abbr: 'USA', flag: 'flag'}];
  }

  username: string;
  password: string;
  mail: string;
  firstname: string;
  lastname: string;
  country: string;
  type: string;

  passwordConfirmation: string;

  countries: Object[];

  register () {

  }

}
