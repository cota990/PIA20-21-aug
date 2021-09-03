import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/models/Country';
import { Participant } from 'src/app/models/Participant';
import { Sport } from 'src/app/models/Sport';
import { CountryService } from 'src/app/services/country.service';
import { ParticipantService } from 'src/app/services/participant.service';
import { SportService } from 'src/app/services/sport.service';
import { DisciplineSelect } from 'src/app/utils/DisciplineSelect';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit {

  constructor(private countryService: CountryService, 
              private sportService: SportService, 
              private participantsService:ParticipantService) { }

  ngOnInit(): void {

    this.countries = [];
    this.sports = [];
    this.disciplines = [];
    this.participants = [];
    this.allParticipants = [];
    this.medalWinnersOnly = false;
    this.participantsPerPage = 20;
    this.participantsPerPageString = '20';
    this.participantsForDisplay = [];

    this.countryService.getAllCountries().subscribe((countries: Country[]) => {

      let allCountries = new Country();
      allCountries.name = 'All countries';
      allCountries.abbr = 'ALL';

      this.countries.push (allCountries);
      countries.forEach ((country) => {
        
        this.countries.push(country);
      
      });
      
      this.country = 'ALL';

    });

    this.sportService.getAllSportsInOlympics().subscribe((sports: Sport[]) => {

      this.allSports = sports;

      let allSports = 'All sports';    

      this.sports.push (allSports);

      this.disciplines.push ('All disciplines');

      sports.forEach((sport) => {

        if (this.sports.indexOf(sport.name))

          this.sports.push (sport.name);

        if (sport.name != sport.discipline)
          this.disciplines.push (sport.discipline);

      });
      
      this.sport = 'All sports';
      this.discipline = 'All disciplines';

    })

    this.participantsService.getAllPariticpants().subscribe((participants: Participant[]) => {

      this.participants = participants;
      this.allParticipants = participants;

      this.numOfPagesParticipants = Math.floor((this.allParticipants.length / this.participantsPerPage)) + 1;
      this.currentPageParticipants = 1;

      let range = this.participantsPerPage;
      if (range > this.participants.length)
        range = this.participants.length;

      for (let i = 0; i < range; i++)
        this.participantsForDisplay.push (this.participants[i]);
    
    });

  }

  name: string;
  country: string;
  sport: string;
  discipline: string;
  gender: string;
  medalWinnersOnly: boolean;

  countries: Country[];
  allSports: Sport[];

  sports: String[];
  disciplines: String[];

  participants: Participant[];
  allParticipants: Participant[];
  participantsForDisplay: Participant[];

  numOfPagesParticipants: number;
  currentPageParticipants: number;
  inputPageParticipants: number;

  participantsPerPage: number;
  participantsPerPageString: string;

  setDisciplines () {
    console.log ('sport changed');

    this.disciplines = [];

    if (this.sport == 'All sports') {

      this.disciplines.push ('All disciplines');

      this.allSports.forEach((sport) => {

        if (sport.name != sport.discipline)
          this.disciplines.push (sport.discipline);

      });

      this.discipline = 'All disciplines';

    }
      

   else {
  
      let disciplines: String [] = [];
      disciplines.push ('All disciplines');
      
      this.allSports.forEach ((sd) => {

        if (sd.name == this.sport
            && sd.name != sd.discipline) {

          disciplines.push (sd.discipline);
        
        }
      
      })

      this.disciplines = disciplines;
      this.discipline = 'All disciplines';

    }

  }

  goToPageParticipants() {

    console.log ('goToPageParticipants');
    console.log (this.inputPageParticipants);
    console.log (this.numOfPagesParticipants);

    if (this.inputPageParticipants > this.numOfPagesParticipants)
      this.inputPageParticipants = this.numOfPagesParticipants;

      console.log (this.inputPageParticipants);

    
    if (this.inputPageParticipants >= 1 && this.inputPageParticipants <= this.numOfPagesParticipants) {

      let i = (this.inputPageParticipants - 1) * this.participantsPerPage;
      let range = i + this.participantsPerPage;
      if (range > this.participants.length)
        range = this.participants.length;

      this.participantsForDisplay = [];

      for (i; i < range; i++)
        this.participantsForDisplay.push (this.participants[i]);

      this.currentPageParticipants = this.inputPageParticipants;

    }

  }

  goToPreviousPageParticipants () {
    
    this.currentPageParticipants--;
    
    let i = (this.currentPageParticipants - 1) * this.participantsPerPage;
    let range = i + this.participantsPerPage;
    if (range > this.participants.length)
      range = this.participants.length;

    this.participantsForDisplay = [];

    for (i; i < range; i++)
      this.participantsForDisplay.push (this.participants[i]);

  }

  goToNextPageParticipants () {

    this.currentPageParticipants++;
    
    let i = (this.currentPageParticipants - 1) * this.participantsPerPage;
    let range = i + this.participantsPerPage;
    if (range > this.participants.length)
      range = this.participants.length;

    this.participantsForDisplay = [];

    for (i; i < range; i++)
      this.participantsForDisplay.push (this.participants[i]);

  }

  changeParticipantsPerPage () {

    console.log ('changeParticipantsPerPage');

    this.participantsPerPage = parseInt(this.participantsPerPageString);

    console.log (this.participantsPerPage);

    this.numOfPagesParticipants = Math.floor((this.participants.length / this.participantsPerPage)) + 1;
    this.currentPageParticipants = 1;

    this.participantsForDisplay = [];

    let range = this.participantsPerPage;
    if (range > this.participants.length)
      range = this.participants.length;

    for (let i = 0; i < range; i++)
      this.participantsForDisplay.push (this.participants[i]);

  }

  search () {

    this.participants = this.allParticipants;

    if (this.name != undefined && this.name != '') {

      this.participants = this.participants.filter( p => p.fullname.toLowerCase().includes(this.name.toLowerCase()));

    }

    if (this.country != undefined && this.country != '' && this.country != 'All countries') {

      this.participants = this.participants.filter( p => p.country.toLowerCase().includes(this.country.toLowerCase()));

    }

    if (this.gender != undefined && this.gender != '') {

      this.participants = this.participants.filter( p => p.gender == this.gender);
      
    }

    this.numOfPagesParticipants = Math.floor((this.participants.length / this.participantsPerPage)) + 1;
    this.currentPageParticipants = 1;

    this.participantsForDisplay = [];

    let range = this.participantsPerPage;
    if (range > this.participants.length)
      range = this.participants.length;

    for (let i = 0; i < range; i++)
      this.participantsForDisplay.push (this.participants[i]);

  }

}
