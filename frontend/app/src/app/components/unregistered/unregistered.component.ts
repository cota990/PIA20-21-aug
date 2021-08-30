import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Country } from 'src/app/models/Country';
import { CountryService } from 'src/app/services/country.service';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-unregistered',
  templateUrl: './unregistered.component.html',
  styleUrls: ['./unregistered.component.css']
})
export class UnregisteredComponent implements OnInit {

  constructor(private countryService:CountryService, private router: Router) { }

  ngOnInit(): void {

    //this.router.navigate([{outlets: {menuRouterOutlet: 'menuUnregistered'}}]);

    MenuComponent.menuSelector = 'unregistered';

    this.nameSortDirection = '';
    this.numOfParticipantsSortDirection = '';

    this.countryService.getAllCountries().subscribe( (res:Country[]) => {

      this.countries = res;
      this.participatingCountries = res;
      this.medalCountCountries = res;

      this.medalCountCountries.sort((a, b) => {

        if (a.numOfGoldMedals > b.numOfGoldMedals) return 1;
        else if (a.numOfGoldMedals < b.numOfGoldMedals) return -1;
        else {

          if (a.numOfSilverMedals > b.numOfSilverMedals) return 1;
          else if (a.numOfSilverMedals < b.numOfSilverMedals) return -1;
          else {

            if (a.numOfBronzeMedals > b.numOfBronzeMedals) return 1;
            else if (a.numOfBronzeMedals < b.numOfBronzeMedals) return -1;
            else {

              if (a.name > b.name) return 1;
              else if (a.name < b.name) return -1;
              else return 0;
            }

          }

        }

      });

      let i = 1;

      this.medalCountCountries.forEach ((country) => {
        country.ranking = i++;
        country.numOfTotalMedals = country.numOfGoldMedals + country.numOfSilverMedals + country.numOfBronzeMedals;
      })

    });

  }

  countries: Country[];
  participatingCountries: Country[];
  medalCountCountries: Country [];

  nameSortDirection: string;
  numOfParticipantsSortDirection: string;

  sortByName() {
    
    if (this.nameSortDirection == '') {

      this.nameSortDirection = 'asc';
      this.participatingCountries.sort((a,b) => {

        if (a.name > b.name) return 1;
        else if (a.name < b.name) return -1;
        else return 0;

      });

    }

    else if (this.nameSortDirection == 'asc') {

      this.nameSortDirection = 'desc';
      this.participatingCountries.sort((a,b) => {

        if (a.name > b.name) return -1;
        else if (a.name < b.name) return 1;
        else return 0;

      });

    }

    else if (this.nameSortDirection == 'desc') {
      
      this.nameSortDirection = 'asc';
      this.participatingCountries.sort((a,b) => {

        if (a.name > b.name) return 1;
        else if (a.name < b.name) return -1;
        else return 0;

      });

    }

  }

  sortByNumOfParticipants () {

    if (this.numOfParticipantsSortDirection == '') {

      this.numOfParticipantsSortDirection = 'asc';
      this.participatingCountries.sort((a,b) => {

        if (a.numOfParticipants > b.numOfParticipants) return 1;
        else if (a.numOfParticipants < b.numOfParticipants) return -1;
        else return 0;

      });

    }

    else if (this.numOfParticipantsSortDirection == 'asc') {

      this.numOfParticipantsSortDirection = 'desc';
      this.participatingCountries.sort((a,b) => {

        if (a.numOfParticipants > b.numOfParticipants) return -1;
        else if (a.numOfParticipants < b.numOfParticipants) return 1;
        else return 0;

      });

    }

    else if (this.numOfParticipantsSortDirection == 'desc') {
      
      this.numOfParticipantsSortDirection = 'asc';
      this.participatingCountries.sort((a,b) => {

        if (a.numOfParticipants > b.numOfParticipants) return 1;
        else if (a.numOfParticipants < b.numOfParticipants) return -1;
        else return 0;

      });

    }
    
  }
  
}
