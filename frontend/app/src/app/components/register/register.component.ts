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

    this.errorsFound = '';

    this.countryService.getAllCountries().subscribe( (res:Country[]) => {

        this.countries = res;

        this.countries.sort ((a, b) => {

          if (a.name > b.name) return 1;
          else if (a.name < b.name) return -1;
          else return 0;
        })

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

  errorsFound: string

  register () {

    if (this.username == undefined || this.username == ''
          || this.password == undefined || this.password == ''
          || this.passwordConfirmation == undefined || this.passwordConfirmation == ''
          || this.mail == undefined || this.mail == ''
          || this.firstname == undefined || this.firstname == ''
          || this.lastname == undefined || this.lastname == ''
          || this.country == undefined || this.country == ''
          || this.type == undefined || this.type == '')
      
      this.errorsFound = 'All fields are required';
    
    else if (this.password != this.passwordConfirmation)
          
      this.errorsFound = 'Password confirmation does not match password';

    else {

      this.errorsFound = '';

      this.userService.register(this.username, this.password, this.mail, this.firstname, this.lastname, this.country, this.type).subscribe(res => {

        if (res['message'] == 'Errors found') {
          
          if (res['mailTaken'] != '')
            this.errorsFound += res['mailTaken'] + '. ';

          if (res['usernameTaken'] != '')
            this.errorsFound += res['usernameTaken'] + '. ';

          if (res['leaderExists'] != '')
            this.errorsFound += res['leaderExists'] + '. ';

          if (res['passwordRules'] != '')
            this.errorsFound += res['passwordRules'];
          
        }

        else if (res['message'] == 'There was an error while processing your request. Please try again later')
          this.errorsFound = 'There was an error while processing your request. Please try again later.';

        else if (res['message'] == 'Request is being processed; awaiting confirmation')
          this.errorsFound = 'Registered successfully; awaiting confirmation from organizer.';

      })

    }
    
  }

}
