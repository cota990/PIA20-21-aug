import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/models/Country';
import { CountryService } from 'src/app/services/country.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  constructor(private countryService: CountryService) { }

  ngOnInit(): void {

    this.countryService.getAllCountries().subscribe((res: Country[]) => {

      this.participatingCountries = res.filter ((country) => {
        return country.numOfParticipants > 0;
      });
      this.participatingCountriesForDisplay = [];
      this.numOfPagesParticipatingCountries = Math.floor((this.participatingCountries.length / 10)) + 1;
      this.currentPageParticipatingCountries = 1;

      let i:number;

      let range = 10;
      if (range > this.participatingCountries.length)
        range = this.participatingCountries.length;

      for (i = 0; i < range; i++)
        this.participatingCountriesForDisplay.push (this.participatingCountries[i]);

      this.medalCountCountries = res;
      

      this.medalCountCountries.sort ((a, b) => {

        if (a.numOfGoldMedals > b.numOfGoldMedals) return -1;
        else if (a.numOfGoldMedals < b.numOfGoldMedals) return 1;
        else {

          if (a.numOfSilverMedals > b.numOfSilverMedals) return -1;
          else if (a.numOfSilverMedals < b.numOfSilverMedals) return 1;
          else {

            if (a.numOfBronzeMedals > b.numOfBronzeMedals) return -1;
            else if (a.numOfBronzeMedals < b.numOfBronzeMedals) return 1;
            else {

              if (a.name > b.name) return -1;
              else if (a.name < b.name) return 1;
              else return 0;
            }

          }

        }
      })

      i = 1;

      this.medalCountCountries.forEach ((country) => {
        country.ranking = i++;
        country.numOfTotalMedals = country.numOfGoldMedals + country.numOfSilverMedals + country.numOfBronzeMedals;        
      })

      this.medalCountCountries = this.medalCountCountries.filter( (country) => {
        return country.numOfTotalMedals > 0;
      });

      this.medalCountCountriesForDisplay = this.medalCountCountries;

    })
  }

  participatingCountries: Country[];
  medalCountCountries: Country [];

  participatingCountriesForDisplay: Country [] = [];
  medalCountCountriesForDisplay: Country [] = [];

  numOfPagesParticipatingCountries: number;
  currentPageParticipatingCountries: number;
  inputPageParticipatingCountries: number;

  numOfPagesMedalCount: number;
  currentPageMedalCount: number;
  inputPageMedalCount: number;

  goToPageParticipatingCountries() {

    if (this.inputPageParticipatingCountries > this.numOfPagesParticipatingCountries)
      this.inputPageParticipatingCountries = this.numOfPagesParticipatingCountries;
    
    if (this.inputPageParticipatingCountries >= 1 && this.inputPageParticipatingCountries <= this.numOfPagesParticipatingCountries) {

      let i = (this.inputPageParticipatingCountries - 1) * 10;
      let range = i + 10;
      if (range > this.participatingCountries.length)
        range = this.participatingCountries.length;

      this.participatingCountriesForDisplay = [];

      for (i; i < range; i++)
        this.participatingCountriesForDisplay.push (this.participatingCountries[i]);

      this.currentPageParticipatingCountries = this.inputPageParticipatingCountries;

    }
  }

  goToPageMedalCount() {

    if (this.inputPageMedalCount > this.numOfPagesMedalCount)
      this.inputPageMedalCount = this.numOfPagesMedalCount;
    
    if (this.inputPageMedalCount >= 1 && this.inputPageMedalCount <= this.numOfPagesMedalCount) {

      let i = (this.inputPageMedalCount - 1) * 10;
      let range = i + 10;
      if (range > this.medalCountCountries.length)
        range = this.medalCountCountries.length;

      this.medalCountCountriesForDisplay = [];

      for (i; i < range; i++)
        this.medalCountCountriesForDisplay.push (this.medalCountCountries[i]);

      this.currentPageMedalCount = this.inputPageMedalCount;

    }
  }

  goToPreviousPageParticipatingCountries () {
    
    this.currentPageParticipatingCountries--;
    
    let i = (this.currentPageParticipatingCountries - 1) * 10;
    let range = i + 10;
    if (range > this.participatingCountries.length)
      range = this.participatingCountries.length;

    this.participatingCountriesForDisplay = [];

    for (i; i < range; i++)
      this.participatingCountriesForDisplay.push (this.participatingCountries[i]);
    

  }

  goToPreviousPageMedalCount () {
    
    this.currentPageMedalCount--;
    
    let i = (this.currentPageMedalCount - 1) * 10;
    let range = i + 10;
    if (range > this.medalCountCountries.length)
      range = this.medalCountCountries.length;

    this.medalCountCountriesForDisplay = [];

    for (i; i < range; i++)
      this.medalCountCountriesForDisplay.push (this.medalCountCountries[i]);
    

  }

  goToNextPageParticipatingCountries () {

    this.currentPageParticipatingCountries++;
    
    let i = (this.currentPageParticipatingCountries - 1) * 10;
    let range = i + 10;
    if (range > this.participatingCountries.length)
      range = this.participatingCountries.length;

    this.participatingCountriesForDisplay = [];

    for (i; i < range; i++)
      this.participatingCountriesForDisplay.push (this.participatingCountries[i]);

  }

  goToNextPageMedalCount () {

    this.currentPageMedalCount++;
    
    let i = (this.currentPageMedalCount - 1) * 10;
    let range = i + 10;
    if (range > this.medalCountCountries.length)
      range = this.medalCountCountries.length;

    this.medalCountCountriesForDisplay = [];

    for (i; i < range; i++)
      this.medalCountCountriesForDisplay.push (this.medalCountCountries[i]);

  }

}
