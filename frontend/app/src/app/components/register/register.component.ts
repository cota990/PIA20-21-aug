import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/models/Country';
import { CountryService } from 'src/app/services/country.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private userService: UserService, private countryService: CountryService) { }

  ngOnInit(): void {
      this.countryService.getAllCountries().subscribe( (res:Country[]) => {

        this.countries = res;
        
      });
  }

  username: string;
  password: string;
  mail: string;
  firstname: string;
  lastname: string;
  country: string;
  type: string;

  passwordConfirmation: string;

  countries: Country[];

  register () {

    this.userService.register(this.username, this.password, this.passwordConfirmation, this.mail, this.firstname, this.lastname, this.country, this.type).subscribe(res => {

      console.log (res);
      console.log (res['status']);
    })
  }

}
