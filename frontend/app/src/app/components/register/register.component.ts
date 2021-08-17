import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private userService: UserService) { }

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

    this.userService.register(this.username, this.password, this.passwordConfirmation, this.mail, this.firstname, this.lastname, this.country, this.type).subscribe(res => {

      console.log (res);
      console.log (res['status']);
    })
  }

}
