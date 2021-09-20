import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/models/Country';
import { Participant } from 'src/app/models/Participant';
import { Sport } from 'src/app/models/Sport';
import { CountryService } from 'src/app/services/country.service';
import { ParticipantService } from 'src/app/services/participant.service';
import { SportService } from 'src/app/services/sport.service';
import { ParticipantPerSport } from 'src/app/utils/ParticipantPerSport';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor(private sportsService: SportService, private participantService: ParticipantService, private countryService: CountryService) { }

  ngOnInit(): void {

    let signedInUser = JSON.parse(sessionStorage.getItem('user'));

    this.selectedSport = undefined;
    this.selectedDiscipline = undefined;
    this.disciplineOptions = undefined;

    this.countryService.getCountryByAbbr(signedInUser.country).subscribe( (country: Country) => {
      this.country = country;
      this.countryName = country.name;
    })

    this.sportsService.getAllSportsInOlympics().subscribe((sports: Sport[]) => {
      
      this.allSports = sports;

      this.sportOptions = [];

      sports.forEach ((s) => {

        if (this.sportOptions.indexOf (s.name) == -1)
          this.sportOptions.push (s.name);
      
        })

    })

    this.participantService.getAllParticipantsForCountry(signedInUser.country).subscribe( (participants: Participant[]) => {

      this.allParticipants = participants;
      this.numOfParticipants = participants.length;

      this.allParticipants.forEach ((participant) => {

        let foundSport: boolean = false;

        this.participantsSports.forEach ((partSport) => {

          if (participant.sport == partSport.sport) {
            
            foundSport = true;
            partSport.participants++;

          }

        })

        if (!foundSport) {
          let newPartSport: ParticipantPerSport = new ParticipantPerSport();
          newPartSport.participants = 1;
          newPartSport.sport = participant.sport;

          this.participantsSports.push (newPartSport);

        }
      })

    })
  }

  allSports: Sport[];
  allParticipants: Participant[];
  
  numOfParticipants: number = 0;
  country: Country;
  countryName: string = '';

  participantsSports: ParticipantPerSport[] = [];

  selectedSport: string;
  selectedDiscipline: string;

  sportOptions: string[];
  disciplineOptions: string[];

  displayParticipants: Participant[];

  selectSportFromTable(sport: string) {
    
    this.selectedSport = sport;
    this.selectedDiscipline = undefined;
    this.displayParticipants = undefined;
    this.goToSport ();

  }

  goToStart() {

    this.selectedDiscipline = undefined;
    this.selectedSport = undefined;
    this.displayParticipants = undefined;

  }

  goToSport() {

    console.log ('display disciplines');

    this.disciplineOptions = [];
    this.selectedDiscipline = undefined;
    this.displayParticipants = undefined;

    this.allSports.forEach ((s) => {

      if (s.name == this.selectedSport
            && s.discipline != this.selectedSport)
            this.disciplineOptions.push (s.discipline);

    })

    if (this.disciplineOptions.length == 0)
      this.filterParticipants ();

  }

  goToDiscipline() {
    this.filterParticipants ();
  }

  filterParticipants () {

    this.displayParticipants = this.allParticipants.filter(p => p.sport == this.selectedSport);

    if (this.disciplineOptions.length > 0)
      this.displayParticipants = this.displayParticipants.filter (p => p.disciplines.includes(this.selectedDiscipline));

      this.displayParticipants.sort ((a,b) => {

        if (a.lastname > b.lastname) return 1;
        else if (a.lastname < b.lastname) return -1;
        else {

          if (a.firstname > b.firstname) return 1;
          else if (a.firstname < b.firstname) return -1;
          else return 0;
          
        };

      });
    
  }

}
